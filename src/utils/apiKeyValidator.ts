export interface ValidatedApiKeyInfo {
  apiKey: string;
  keyName: string;
  provider: 'kimi' | 'openai' | 'groq' | 'gemini' | 'custom';
  maskedKey: string;
}

/**
 * Validates and retrieves the active API key from environment variables (process.env).
 * Prioritizes GEMINI_API_KEY, then GROQ_API_KEY, then KIMI_API_KEY, then OPENAI_API_KEY.
 */
export function validateApiKey(): ValidatedApiKeyInfo {
  const env = process.env;
  
  const rawGeminiKey = env.GEMINI_API_KEY?.trim();
  const rawGroqKey = env.GROQ_API_KEY?.trim();
  const rawKimiKey = env.KIMI_API_KEY?.trim();
  const rawOpenAIKey = (env.OPENAI_API_KEY || env.NVIDIA_API_KEY || env.CHATGPT_API_KEY)?.trim();

  let apiKey = '';
  let keyName = 'None';
  let provider: 'kimi' | 'openai' | 'groq' | 'gemini' | 'custom' = 'custom';

  if (rawGeminiKey && !rawGeminiKey.startsWith('sk-')) {
    apiKey = rawGeminiKey;
    keyName = 'GEMINI_API_KEY';
    provider = 'gemini';
  } else if (rawKimiKey) {
    apiKey = rawKimiKey;
    keyName = 'KIMI_API_KEY';
    provider = 'kimi';
  } else if (rawGroqKey && rawGroqKey.startsWith('gsk_')) {
    apiKey = rawGroqKey;
    keyName = 'GROQ_API_KEY';
    provider = 'groq';
  } else if (rawOpenAIKey) {
    apiKey = rawOpenAIKey;
    keyName = 'OPENAI_API_KEY';
    provider = 'openai';
  } else if (rawGroqKey) {
    apiKey = rawGroqKey;
    keyName = 'GROQ_API_KEY';
    provider = 'groq';
  } else if (rawGeminiKey) {
    apiKey = rawGeminiKey;
    keyName = 'GEMINI_API_KEY';
    provider = 'gemini';
  }

  if (!apiKey) {
    apiKey = 'fallback-mode';
    keyName = 'None';
    provider = 'custom';
  }

  const maskedKey = apiKey.length > 8 
    ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`
    : '********';

  return {
    apiKey,
    keyName,
    provider,
    maskedKey
  };
}

