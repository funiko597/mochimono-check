# Voice Dictation 🎤 (Typeless風 音声入力ツール / macOS常駐)

ショートカット一発で **喋る → 文字起こし → Claude が整形 → 今カーソルがあるアプリへ自動入力** までを行う、メニューバー常駐アプリです。
Typeless の「裏で Claude が整えてくれる」体験を、自分の API キーで再現します。

```
[ホットキー] → 録音 → Whisperで文字起こし → Claudeで整形 → Cmd+Vで貼り付け
```

- **どのアプリにも入力できる**（Slack / メール / メモ / エディタ等。クリップボード経由で Cmd+V）
- **Claude整形**: フィラー（「えーと」等）除去・言い直しの整理・誤変換修正（意味は変えない）
- **文字起こしは差し替え自由**: OpenAI / Groq / **ローカルWhisper**（プライバシー重視ならローカル）

> ⚠️ デスクトップ常駐型なので、マイク権限・アクセシビリティ権限（自動貼り付け用）が必要です。
> リモート環境では動作確認できないため「実機で動かす土台」として作っています。仕上げはお手元で。

---

## 1. セットアップ

```bash
cd voice-dictation
npm install
npm start
```

初回起動時に設定ファイル（`config.json`）が自動生成され、APIキーが未設定なら案内ダイアログが出ます。

### APIキーの設定

メニューバーのアイコン → **「設定ファイルを開く」** から `config.json` を編集します。

```jsonc
{
  "hotkey": "CommandOrControl+Shift+D",

  // 文字起こし（OpenAI互換エンドポイント）
  "transcribeBaseUrl": "https://api.openai.com/v1",
  "transcribeApiKey": "sk-...",
  "transcribeModel": "whisper-1",
  "language": "ja",          // 空 "" で自動判定

  // Claude整形
  "cleanup": true,
  "anthropicApiKey": "sk-ant-...",
  "cleanupModel": "claude-opus-4-8",  // 速度優先なら "claude-haiku-4-5"

  "autoPaste": true,
  "restoreClipboard": false
}
```

環境変数 `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` でも代用できます（`config.json` 未設定時のフォールバック）。

---

## 2. 使い方

1. メニューバーに 🎤 が常駐します
2. **ホットキー（既定 `⌘⇧D`）を押すと録音開始**（アイコンが 🔴）
3. 喋り終えたら**もう一度ホットキー**で停止 → 文字起こし＆整形（⏳）
4. 完了すると、**今フォーカスしているアプリのカーソル位置へ自動で貼り付き**ます

メニューから「Claudeで整形する」のON/OFF、設定再読み込みも可能です。

---

## 3. 必要な権限（macOS）

`システム設定 → プライバシーとセキュリティ` で、起動元アプリ（開発実行時は **Electron** / ターミナル）に許可を与えてください。

| 権限 | 用途 |
|---|---|
| **マイク** | 音声の録音 |
| **アクセシビリティ** | `Cmd+V` の自動送出（自動貼り付け） |

`autoPaste: false` にすると貼り付けはせず、整形結果をクリップボードに置くだけになります（アクセシビリティ権限不要）。

---

## 4. 文字起こしエンジンの差し替え

`transcribeBaseUrl` / `transcribeApiKey` / `transcribeModel` を変えるだけ。OpenAI互換ならそのまま動きます。

| 用途 | baseUrl | model |
|---|---|---|
| OpenAI | `https://api.openai.com/v1` | `whisper-1` |
| Groq（高速・安価） | `https://api.groq.com/openai/v1` | `whisper-large-v3` |
| ローカル（プライバシー重視） | `http://127.0.0.1:8080/v1` 等 | サーバー依存 |

> ローカルは [faster-whisper サーバー] や [whisper.cpp の server] など、OpenAI互換APIを立てれば音声を外部に出さず完結できます。

---

## 5. 仕組み（ファイル構成）

| ファイル | 役割 |
|---|---|
| `src/main.js` | 常駐・トレイ・ホットキー・全体のオーケストレーション |
| `src/recorder.html` | 不可視レンダラ。マイク録音（MediaRecorder） |
| `src/transcribe.js` | 音声→テキスト（OpenAI互換 `/audio/transcriptions`） |
| `src/cleanup.js` | テキスト→整形済みテキスト（Claude `claude-opus-4-8`） |
| `src/paste.js` | クリップボード＋`Cmd+V`送出で貼り付け |
| `src/config.js` | 設定の読み込み・テンプレート生成 |

---

## 6. 注意・限界

- **コスト**: 文字起こしAPIとClaude APIの従量課金が発生します。整形を `claude-haiku-4-5` にすると低レイテンシ・低コストです。
- **対応OS**: 自動貼り付けは macOS（`osascript`）前提。Windows対応は別途キー送出の実装が必要です。
- これは「自作版の土台」です。配布用ビルド（`.app`化・署名・公証）や、push-to-talk方式への変更などは拡張ポイントとして残しています。
