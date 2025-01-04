import { Injectable } from '@nestjs/common';
import { PlaywrightWebBaseLoader } from '@langchain/community/document_loaders/web/playwright';
import * as cheerio from 'cheerio';
import { LlmService } from '../llm/llm.service';
import { HumanMessage } from '@langchain/core/messages';
import { JobDescriptionParsingSchema, ParsedJobDescription } from './job-description.dto';

@Injectable()
export class JobDescriptionService {
  constructor(private readonly llmService: LlmService) {}

  private parsingModel = this.llmService.getParsingModel(JobDescriptionParsingSchema);

  async parseJobDescription(jobUrl: string): Promise<ParsedJobDescription> {
    const loader = new PlaywrightWebBaseLoader(jobUrl);
    const docs = await loader.load();
    const $ = cheerio.load(docs[0].pageContent);
    const visibleText = $('body')
      .find('*')
      .contents()
      .filter(function () {
        return this.type === 'text';
      })
      .map(function () {
        return $(this).text().trim();
      })
      .get()
      .join(' ');

    const res = await this.parsingModel.invoke({ messages: [new HumanMessage({ content: visibleText })] });

    return JobDescriptionParsingSchema.parse(res.messages[0]);
  }
}
