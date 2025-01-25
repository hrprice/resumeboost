import { InjectModel } from '@nestjs/mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { LlmService } from '../llm/llm.service';
import { HumanMessage } from '@langchain/core/messages';
import { JobDescriptionParsingSchema } from './job-description.dto';
import { JobDescription } from './job-description.model';
import { InjectBrowser } from 'nestjs-playwright';
import { Browser } from 'playwright';
import { Model } from 'mongoose';

@Injectable()
export class JobDescriptionService {
  constructor(
    @InjectBrowser() private readonly browser: Browser,
    private readonly llmService: LlmService,
    @InjectModel(JobDescription.name) private readonly jobDescriptionModel: Model<JobDescription>
  ) {}

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

  async parseJobDescription(jobUrl: string): Promise<JobDescription> {
    const visibleText = await this.getJobDescriptionHtml(jobUrl);
    if (visibleText.length > 20000)
      throw new InternalServerErrorException(`character limit exceeded, length: ${visibleText.length}`);
    const res = await this.parsingModel.invoke({ messages: [new HumanMessage({ content: visibleText })] });
    const parsed = JobDescriptionParsingSchema.parse(res.messages[0]);
    return this.saveJobDescription(parsed, jobUrl);
  }

  async saveJobDescription(
    parsedJobDescription: ReturnType<typeof JobDescriptionParsingSchema.parse>,
    jobUrl: string
  ): Promise<JobDescription> {
    const doc = await this.jobDescriptionModel.create({
      ...parsedJobDescription,
      url: jobUrl
    });
    if (!doc) throw new InternalServerErrorException();
    return doc;
  }

  async getJobDescriptionById(id: string): Promise<JobDescription | null> {
    return this.jobDescriptionModel.findById(id);
  }
}
