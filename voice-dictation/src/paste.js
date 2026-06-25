'use strict';

// 整形済みテキストをクリップボードへ置き、アクティブなアプリへ Cmd+V を送出して貼り付ける。
// macOS の System Events 経由（アクセシビリティ権限が必要）。

const { clipboard } = require('electron');
const { execFile } = require('child_process');

function sendPasteKeystroke() {
  return new Promise((resolve, reject) => {
    // osascript で前面アプリに Cmd+V を送る
    execFile(
      'osascript',
      ['-e', 'tell application "System Events" to keystroke "v" using command down'],
      (err) => (err ? reject(err) : resolve())
    );
  });
}

async function deliverText(text, cfg) {
  const previous = cfg.restoreClipboard ? clipboard.readText() : null;
  clipboard.writeText(text);

  if (!cfg.autoPaste) return; // クリップボードに置くだけ（手動で貼り付け）

  // クリップボード反映を待ってから貼り付け
  await new Promise((r) => setTimeout(r, 120));
  await sendPasteKeystroke();

  if (cfg.restoreClipboard && previous !== null) {
    setTimeout(() => clipboard.writeText(previous), 600);
  }
}

module.exports = { deliverText };
