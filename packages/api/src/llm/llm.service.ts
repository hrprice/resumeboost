import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';

@Injectable()
export class LlmService {
  constructor(private readonly configService: ConfigService) {}

  getParsingModel(outputSchema: z.ZodObject<any>) {
    const StateAnnotation = Annotation.Root({
      messages: Annotation<BaseMessage[]>()
    });

    const llm = new ChatOpenAI({
      model: this.configService.get('OPENAI_CHAT_MODEL', 'gpt-3.5-turbo'),
      apiKey: this.configService.getOrThrow('OPENAI_API_KEY')
    });

    const jsonExtractor = async (state: typeof StateAnnotation.State) => {
      return {
        messages: [await llm.withStructuredOutput(outputSchema).invoke(state.messages)]
      };
    };

    return new StateGraph(StateAnnotation)
      .addNode('jsonExtractor', jsonExtractor)
      .addEdge(START, 'jsonExtractor')
      .addEdge('jsonExtractor', END)
      .compile();
  }
}
