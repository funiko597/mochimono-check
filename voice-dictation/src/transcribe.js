'use strict';

// 音声バッファを文字起こしする。OpenAI 互換の /audio/transcriptions を叩くだけなので、
// OpenAI / Groq / ローカル Whisper サーバーのいずれにも config だけで切り替えられる。
// Electron(Node 18+) のグローバル fetch / FormData / Blob を使用するため追加依存なし。

async function transcribe(audioBuffer, cfg) {
  if (!cfg.transcribeApiKey) {
    throw new Error('文字起こし用の API キー (transcribeApiKey / OPENAI_API_KEY) が未設定です。');
  }

  const form = new FormData();
  form.append('file', new Blob([audioBuffer], { type: 'audio/webm' }), 'audio.webm');
  form.append('model', cfg.transcribeModel);
  if (cfg.language) form.append('language', cfg.language);

  const url = `${cfg.transcribeBaseUrl.replace(/\/$/, '')}/audio/transcriptions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.transcribeApiKey}` },
    body: form,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`文字起こしに失敗 (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  return (data.text || '').trim();
}

module.exports = { transcribe };
