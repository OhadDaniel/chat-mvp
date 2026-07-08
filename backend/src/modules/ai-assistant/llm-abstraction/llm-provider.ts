import type { ProviderRequest, ProviderStreamEvent } from './llm.types';


export abstract class LlmProvider {
  abstract streamMessage(
    request: ProviderRequest,
  ): AsyncIterable<ProviderStreamEvent>;
}
