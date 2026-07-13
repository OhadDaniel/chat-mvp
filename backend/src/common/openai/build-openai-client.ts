import OpenAI from 'openai';

export function buildOpenAiClient(
  apiKey: string | undefined,
  onMissingKey: () => never,
): OpenAI {
  if (!apiKey) {
    onMissingKey();
  }
  return new OpenAI({ apiKey });
}
