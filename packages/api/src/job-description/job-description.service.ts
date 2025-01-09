import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { LlmService } from '../llm/llm.service';
import { HumanMessage } from '@langchain/core/messages';
import { JobDescriptionParsingSchema, ParsedJobDescription } from './job-description.dto';
import { InjectBrowser } from 'nestjs-playwright';
import { Browser } from 'playwright';

@Injectable()
export class JobDescriptionService {
  constructor(@InjectBrowser() private readonly browser: Browser, private readonly llmService: LlmService) {}

  private parsingModel = this.llmService.getParsingModel(JobDescriptionParsingSchema);

  async getJobDescriptionHtml(jobUrl: string): Promise<string> {
    const page = await this.browser.newPage();

    await page.goto(jobUrl);

    await page.waitForTimeout(3000);

    const htmlContent = await page.content();

    const $ = cheerio.load(htmlContent);

    let visibleText = '';

    $('body')
      .find('*')
      .not('script, style, noscript, iframe, meta, title, link')
      .each((index, element) => {
        const text = $(element).clone().children().remove().end().text().trim();
        if (text) {
          visibleText += text;
        }
      });

    return visibleText;
  }

  async parseJobDescription(jobUrl: string): Promise<ParsedJobDescription> {
    const visibleText = await this.getJobDescriptionHtml(jobUrl);
    if (visibleText.length > 20000)
      throw new InternalServerErrorException(`token limit exceeded, length: ${visibleText.length}`);
    const res = await this.parsingModel.invoke({ messages: [new HumanMessage({ content: visibleText })] });
    return JobDescriptionParsingSchema.parse(res.messages[0]);
  }
}
