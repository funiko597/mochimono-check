'use strict';

// 設定の読み込み。優先順位: config.json > 環境変数 > デフォルト。
// config.json は初回起動時に userData ディレクトリへ自動生成され、
// メニューの「設定ファイルを開く」から編集できる。

const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const DEFAULTS = {
  // 録音開始/停止のグローバルショートカット (Electron の accelerator 形式)
  hotkey: 'CommandOrControl+Shift+D',

  // 文字起こし (OpenAI 互換エンドポイント)
  //   OpenAI:        https://api.openai.com/v1 / whisper-1
  //   Groq(高速安価): https://api.groq.com/openai/v1 / whisper-large-v3
  //   ローカル:       http://127.0.0.1:8080/v1 など (faster-whisper / whisper.cpp server)
  transcribeBaseUrl: 'https://api.openai.com/v1',
  transcribeApiKey: '',
  transcribeModel: 'whisper-1',
  language: 'ja', // 主に話す言語。空文字 '' で自動判定

  // Claude による整形 (Typeless風の "裏で整える" 機能)
  cleanup: true,
  anthropicApiKey: '',
  cleanupModel: 'claude-opus-4-8', // 速度優先なら 'claude-haiku-4-5'

  // 貼り付け挙動
  autoPaste: true, // 整形後に Cmd+V を自動送出
  restoreClipboard: false, // 貼り付け後に元のクリップボード内容へ戻す
};

function configFilePath() {
  return path.join(app.getPath('userData'), 'config.json');
}

function loadConfig() {
  const file = configFilePath();
  let stored = {};
  try {
    if (fs.existsSync(file)) {
      stored = JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (err) {
    console.error('config.json の読み込みに失敗しました:', err);
  }

  const cfg = { ...DEFAULTS, ...stored };

  // 環境変数によるフォールバック (config.json で未設定の場合のみ)
  if (!cfg.transcribeApiKey) {
    cfg.transcribeApiKey = process.env.OPENAI_API_KEY || process.env.TRANSCRIBE_API_KEY || '';
  }
  if (!cfg.anthropicApiKey) {
    cfg.anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
  }

  cfg._file = file;
  return cfg;
}

// 初回起動時にテンプレート config.json を作成する
function ensureConfigFile() {
  const file = configFilePath();
  if (!fs.existsSync(file)) {
    const template = { ...DEFAULTS };
    try {
      fs.writeFileSync(file, JSON.stringify(template, null, 2), 'utf8');
    } catch (err) {
      console.error('config.json の作成に失敗しました:', err);
    }
  }
  return file;
}

module.exports = { loadConfig, ensureConfigFile, configFilePath, DEFAULTS };
