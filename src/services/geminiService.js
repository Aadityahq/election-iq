import { getEnv } from './env';

const API_KEY = getEnv('VITE_GEMINI_API_KEY');

const SYSTEM_PROMPT = `You are ElectionIQ, a friendly and neutral civic education assistant. Your role is to help users understand election processes in simple, clear language.

Guidelines:
- Break down complex topics into 2-3 short steps
- Use bullet points and numbered lists for clarity
- Ask "Does that make sense?" after explanations
- Avoid any political bias or candidate endorsements
- Cite official sources when possible
- If asked about a specific country, tailor your answer to that country's process
- Keep responses concise (under 150 words)
- For off-topic questions, politely redirect to election education`;

export async function getAIResponse(prompt, language = 'English') {
  const finalPrompt = `${SYSTEM_PROMPT}

User asked in ${language}:
${prompt}

Please respond in ${language}.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: finalPrompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Sorry, I could not generate a response. Please try again.'
    );
  } catch (err) {
    console.error('Gemini API error:', err);
    return 'Error connecting to AI. Please check your API key and try again.';
  }
}

export async function detectIntent(userInput) {
  const intentPrompt = `Given this user input about elections, classify it into ONE intent:
  
  Intents:
  - voter_registration: How to register to vote
  - polling_location: Finding polling booth or polling location
  - voting_process: How to vote or voting day procedures
  - vote_counting: How votes are counted
  - election_results: Election results and timelines
  - timeline: Timeline of election phases
  - general: General election knowledge
  
  User input: "${userInput}"
  
  Respond with ONLY the intent name, nothing else.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: intentPrompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const intent = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase() || 'general';
    return intent;
  } catch (err) {
    console.error('Intent detection error:', err);
    return 'general';
  }
}
