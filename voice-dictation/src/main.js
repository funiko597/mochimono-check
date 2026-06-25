'use strict';

const path = require('path');
const {
  app,
  Tray,
  Menu,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  nativeImage,
  Notification,
  shell,
  dialog,
  session,
} = require('electron');

const { loadConfig, ensureConfigFile } = require('./config');
const { transcribe } = require('./transcribe');
const { cleanup } = require('./cleanup');
const { deliverText } = require('./paste');

let tray = null;
let recorderWindow = null;
let cfg = null;
let state = 'idle'; // idle | recording | processing

const STATE_LABEL = {
  idle: '🎤 待機中',
  recording: '🔴 録音中…',
  processing: '⏳ 整形中…',
};

function notify(title, body) {
  try {
    new Notification({ title, body, silent: true }).show();
  } catch (_) {
    /* 通知未対応環境では無視 */
  }
}

// ---- 録音用の不可視ウィンドウ ----------------------------------------------
function createRecorderWindow() {
  recorderWindow = new BrowserWindow({
    width: 200,
    height: 100,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  recorderWindow.loadFile(path.join(__dirname, 'recorder.html'));
}

// ---- トレイ -----------------------------------------------------------------
function buildMenu() {
  return Menu.buildFromTemplate([
    { label: STATE_LABEL[state], enabled: false },
    { type: 'separator' },
    {
      label: state === 'recording' ? '録音を停止して整形' : `録音開始  (${cfg.hotkey})`,
      enabled: state !== 'processing',
      click: () => toggleRecording(),
    },
    {
      label: 'Claude で整形する',
      type: 'checkbox',
      checked: !!cfg.cleanup,
      click: (item) => {
        cfg.cleanup = item.checked;
      },
    },
    { type: 'separator' },
    { label: '設定ファイルを開く', click: () => shell.openPath(cfg._file) },
    { label: '設定を再読み込み', click: () => reloadConfig() },
    { type: 'separator' },
    { label: '終了', click: () => app.quit() },
  ]);
}

function updateTray() {
  if (!tray) return;
  tray.setTitle(` ${STATE_LABEL[state].split(' ')[0]}`); // メニューバーに状態絵文字
  tray.setToolTip(`Voice Dictation — ${STATE_LABEL[state]}`);
  tray.setContextMenu(buildMenu());
}

function setState(next) {
  state = next;
  updateTray();
}

// ---- 設定 -------------------------------------------------------------------
function reloadConfig() {
  const prevHotkey = cfg ? cfg.hotkey : null;
  cfg = loadConfig();
  if (prevHotkey !== cfg.hotkey) {
    registerHotkey();
  }
  updateTray();
  notify('Voice Dictation', '設定を再読み込みしました。');
}

function registerHotkey() {
  globalShortcut.unregisterAll();
  const ok = globalShortcut.register(cfg.hotkey, () => toggleRecording());
  if (!ok) {
    notify('Voice Dictation', `ショートカット "${cfg.hotkey}" を登録できませんでした。`);
  }
}

// ---- 録音フロー -------------------------------------------------------------
function toggleRecording() {
  if (state === 'idle') {
    startRecording();
  } else if (state === 'recording') {
    stopRecording();
  }
  // processing 中は無視
}

function startRecording() {
  if (!recorderWindow) return;
  setState('recording');
  recorderWindow.webContents.send('start-recording');
}

function stopRecording() {
  if (!recorderWindow) return;
  setState('processing');
  recorderWindow.webContents.send('stop-recording');
}

async function processAudio(audioBuffer) {
  try {
    const raw = await transcribe(Buffer.from(audioBuffer), cfg);
    if (!raw) {
      notify('Voice Dictation', '音声を認識できませんでした。');
      setState('idle');
      return;
    }

    let finalText = raw;
    if (cfg.cleanup) {
      try {
        finalText = await cleanup(raw, cfg);
      } catch (err) {
        // 整形に失敗しても素の書き起こしは届ける
        console.error('cleanup failed:', err);
        notify('Voice Dictation', `整形に失敗（書き起こしを使用）: ${err.message}`);
        finalText = raw;
      }
    }

    await deliverText(finalText, cfg);
  } catch (err) {
    console.error(err);
    notify('Voice Dictation エラー', err.message || String(err));
  } finally {
    setState('idle');
  }
}

// ---- IPC --------------------------------------------------------------------
function wireIpc() {
  ipcMain.on('recording-started', () => {
    // 録音が実際に開始した（権限取得済み）。状態は既に recording。
  });

  ipcMain.on('recording-error', (_e, msg) => {
    notify('Voice Dictation', `録音エラー: ${msg}`);
    setState('idle');
  });

  ipcMain.on('audio-data', (_e, buf) => {
    processAudio(buf);
  });
}

// ---- 起動 -------------------------------------------------------------------
function checkKeys() {
  const missing = [];
  if (!cfg.transcribeApiKey) missing.push('文字起こし API キー (OPENAI_API_KEY 等)');
  if (cfg.cleanup && !cfg.anthropicApiKey) missing.push('Claude API キー (ANTHROPIC_API_KEY)');
  if (missing.length) {
    dialog.showMessageBox({
      type: 'info',
      title: 'Voice Dictation — APIキー未設定',
      message: '次のキーが未設定です。設定ファイルを開いて入力してください。',
      detail: missing.join('\n') + `\n\n設定ファイル:\n${cfg._file}`,
      buttons: ['設定ファイルを開く', '後で'],
    }).then((r) => {
      if (r.response === 0) shell.openPath(cfg._file);
    });
  }
}

app.whenReady().then(() => {
  ensureConfigFile();
  cfg = loadConfig();

  // 不可視レンダラのマイク権限を許可
  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
    callback(permission === 'media');
  });

  createRecorderWindow();
  wireIpc();

  // メニューバー常駐（Dock には出さない）
  if (process.platform === 'darwin' && app.dock) app.dock.hide();
  tray = new Tray(nativeImage.createEmpty());
  updateTray();

  registerHotkey();
  checkKeys();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// メニューバー常駐アプリなのでウィンドウを閉じても終了しない
app.on('window-all-closed', (e) => {
  e.preventDefault();
});
