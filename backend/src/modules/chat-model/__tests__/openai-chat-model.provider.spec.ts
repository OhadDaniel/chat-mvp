import { ChatOpenAI } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';
import { OpenAiChatModelProvider } from '../openai-chat-model.provider';
import { ChatModelUnavailableError } from '../errors/chat-model-unavailable.error';
import { DEFAULT_CHAT_MODEL } from '../chat-model.constants';

jest.mock('@langchain/openai', () => ({
  ChatOpenAI: jest.fn().mockImplementation(() => ({ tag: 'chat-model' })),
}));

function configWith(
  values: Record<string, string | undefined>,
): ConfigService {
  return {
    get: (key: string): string | undefined => values[key],
  } as unknown as ConfigService;
}

describe('OpenAiChatModelProvider', () => {
  beforeEach(() => {
    (ChatOpenAI as unknown as jest.Mock).mockClear();
  });

  it('builds a ChatOpenAI with the configured key and model', () => {
    const provider = new OpenAiChatModelProvider(
      configWith({ OPENAI_API_KEY: 'sk-test', OPENAI_MODEL: 'gpt-4o' }),
    );

    provider.getChatModel();

    expect(ChatOpenAI).toHaveBeenCalledWith({
      apiKey: 'sk-test',
      model: 'gpt-4o',
    });
  });

  it('falls back to the default model when OPENAI_MODEL is unset', () => {
    const provider = new OpenAiChatModelProvider(
      configWith({ OPENAI_API_KEY: 'sk-test' }),
    );

    provider.getChatModel();

    expect(ChatOpenAI).toHaveBeenCalledWith({
      apiKey: 'sk-test',
      model: DEFAULT_CHAT_MODEL,
    });
  });

  it('builds the model once and reuses it', () => {
    const provider = new OpenAiChatModelProvider(
      configWith({ OPENAI_API_KEY: 'sk-test' }),
    );

    provider.getChatModel();
    provider.getChatModel();

    expect(ChatOpenAI).toHaveBeenCalledTimes(1);
  });

  it('throws when no API key is configured', () => {
    const provider = new OpenAiChatModelProvider(configWith({}));

    expect(() => provider.getChatModel()).toThrow(ChatModelUnavailableError);
    expect(ChatOpenAI).not.toHaveBeenCalled();
  });
});
