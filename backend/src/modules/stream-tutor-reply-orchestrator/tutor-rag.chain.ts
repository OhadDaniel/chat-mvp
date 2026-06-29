import { StringOutputParser } from '@langchain/core/output_parsers';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { TUTOR_SYSTEM_PROMPT, buildUserPrompt } from './tutor.prompt';

export async function streamTutorAnswer(
  model: BaseChatModel,
  context: string,
  question: string,
): Promise<AsyncIterable<string>> {
  const chain = model.pipe(new StringOutputParser());
  return chain.stream([
    new SystemMessage(TUTOR_SYSTEM_PROMPT),
    new HumanMessage(buildUserPrompt(context, question)),
  ]);
}
