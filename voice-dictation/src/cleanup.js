'use strict';

// 文字起こしテキストを Claude で整形する。Typeless の "裏で Claude が整える" 部分の再現。
// フィラー除去・言い直しの整理・誤変換修正を行い、意味は一切変えない。

const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `あなたは音声入力テキストを整える編集者です。話し言葉の書き起こしを受け取り、意味を一切変えずに整えます。

ルール:
- フィラー（「えーと」「あの」「um」「uh」など）を除去する
- 言い直し・口ごもりは、最終的に意図した内容だけを残す
- 明らかな書き起こしの誤り（同音異義語の取り違えなど）を文脈から自然に修正する
- 句読点・改行を適切に補い、読みやすくする
- 入力の言語をそのまま維持する（日本語は日本語、英語は英語）
- 内容を要約・追加・脚色しない。話者が言ったことだけを整える
- 整えたテキストだけを出力する。前置き・説明・引用符・コードブロックは一切付けない`;

let client = null;
let clientKey = null;

function getClient(apiKey) {
  if (!client || clientKey !== apiKey) {
    client = new Anthropic({ apiKey });
    clientKey = apiKey;
  }
  return client;
}

async function cleanup(text, cfg) {
  if (!cfg.cleanup) return text;
  if (!text) return text;
  if (!cfg.anthropicApiKey) {
    throw new Error('Claude 整形用の API キー (anthropicApiKey / ANTHROPIC_API_KEY) が未設定です。');
  }

  const anthropic = getClient(cfg.anthropicApiKey);
  const res = await anthropic.messages.create({
    model: cfg.cleanupModel || 'claude-opus-4-8',
    max_tokens: 2000,
    // 軽い機械的整形なので低 effort・思考なしで低レイテンシに振る
    output_config: { effort: 'low' },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: text }],
  });

  const out = (res.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();

  return out || text;
}

module.exports = { cleanup, SYSTEM_PROMPT };
