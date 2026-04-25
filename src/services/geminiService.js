import { getEnv } from './env';

const API_KEY = getEnv('VITE_GEMINI_API_KEY');
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Model cascade — fastest/cheapest first, falls back on 429 or error.
 * Add more models here if quotas keep running out.
 */
const MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
];

const SYSTEM_PROMPT = `You are ElectionIQ, a friendly and neutral civic education assistant.
Your role is to help users understand election processes in simple, clear language.

Guidelines:
- Break down complex topics into 2-3 short numbered steps
- Use bullet points for lists
- Avoid any political bias or candidate endorsements
- If asked about a specific country, tailor your answer
- Keep responses concise (under 200 words)
- For off-topic questions, politely redirect to election education
- Do NOT use markdown bold (**text**) — use plain text only`;

/**
 * Try a single model. Returns { ok, text, status }.
 */
async function tryModel(model, body) {
  try {
    const res = await fetch(`${BASE_URL}/${model}:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { ok: false, status: res.status, error: errorData?.error?.message || `HTTP ${res.status}` };
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return { ok: false, status: 200, error: 'Empty response from model' };

    return { ok: true, text };
  } catch (err) {
    return { ok: false, status: 0, error: err.message };
  }
}

/**
 * Main AI response function — cascades through models.
 */
export async function getAIResponse(prompt, language = 'English') {
  const body = {
    contents: [
      {
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\nUser message (respond in ${language}):\n${prompt}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
    },
  };

  let lastError = 'Unknown error';

  for (const model of MODELS) {
    const result = await tryModel(model, body);

    if (result.ok) {
      return result.text;
    }

    lastError = result.error;

    // Only cascade on quota errors; hard-fail on bad key / bad request
    if (result.status === 400 || result.status === 401 || result.status === 403) {
      break;
    }

    // 429 / 500 / network error → try next model
    console.warn(`[ElectionIQ] Model ${model} failed (${result.status}), trying next…`);
  }

  // All models exhausted
  console.error('[ElectionIQ] All models failed:', lastError);
  throw new Error(lastError);
}

/**
 * Classify user intent for potential routing/analytics.
 * Non-critical — always returns a safe default on failure.
 */
export async function detectIntent(userInput) {
  const body = {
    contents: [
      {
        parts: [
          {
            text: `Classify this election-related user query into ONE of these intents:
voter_registration | polling_location | voting_process | vote_counting | election_results | timeline | general

Query: "${userInput}"

Reply with ONLY the intent name.`,
          },
        ],
      },
    ],
    generationConfig: { temperature: 0, maxOutputTokens: 20 },
  };

  for (const model of MODELS) {
    const result = await tryModel(model, body);
    if (result.ok) {
      return result.text.trim().toLowerCase().split(/\s+/)[0] || 'general';
    }
    if (result.status === 400 || result.status === 401 || result.status === 403) break;
  }

  return 'general';
}
