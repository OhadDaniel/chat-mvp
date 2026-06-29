import OpenAI from 'openai';
import { buildOpenAiClient } from '../build-openai-client';

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({ tag: 'openai-client' })),
}));

describe('buildOpenAiClient', () => {
  beforeEach(() => {
    (OpenAI as unknown as jest.Mock).mockClear();
  });

  it('builds a client with the api key when present', () => {
    const client = buildOpenAiClient('sk-test', () => {
      throw new Error('should not run');
    });

    expect(OpenAI).toHaveBeenCalledWith({ apiKey: 'sk-test' });
    expect(client).toEqual({ tag: 'openai-client' });
  });

  it('runs the missing-key handler and never builds a client', () => {
    expect(() =>
      buildOpenAiClient(undefined, () => {
        throw new Error('missing key');
      }),
    ).toThrow('missing key');
    expect(OpenAI).not.toHaveBeenCalled();
  });
});
