import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { BaseMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { RESUME_SYSTEM_PROMPT } from '../constants/resume-constants';
import { z } from 'zod';

@Injectable()
export class LlmService {
  constructor(private readonly configService: ConfigService) {}

  getParsingModel(outputSchema: z.ZodObject<any>, jsonOnly = false) {
    const StateAnnotation = Annotation.Root({
      messages: Annotation<BaseMessage[]>()
    });

    const llm = new ChatOpenAI({
      model: this.configService.get('OPENAI_CHAT_MODEL', 'gpt-3.5-turbo'),
      apiKey: this.configService.getOrThrow('OPENAI_API_KEY')
    });

    const inputFormatter = async (state: typeof StateAnnotation.State) => {
      const res = await llm.invoke([new SystemMessage({ content: RESUME_SYSTEM_PROMPT }), ...state.messages]);
      return { messages: [res.content] };
    };

    const jsonExtractor = async (state: typeof StateAnnotation.State) => {
      return {
        messages: [await llm.withStructuredOutput(outputSchema).invoke(state.messages)]
      };
    };

    if (jsonOnly)
      return new StateGraph(StateAnnotation)
        .addNode('jsonExtractor', jsonExtractor)
        .addEdge(START, 'jsonExtractor')
        .addEdge('jsonExtractor', END)
        .compile();

    return new StateGraph(StateAnnotation)
      .addNode('inputFormatter', inputFormatter)
      .addNode('jsonExtractor', jsonExtractor)
      .addEdge(START, 'inputFormatter')
      .addEdge('inputFormatter', 'jsonExtractor')
      .addEdge('jsonExtractor', END)
      .compile();
  }
}
