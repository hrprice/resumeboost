import { Args, Query, Resolver } from '@nestjs/graphql';
import { JobDescriptionService } from './job-description.service';
import { ParsedJobDescription } from './job-description.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Resolver(() => ParsedJobDescription)
export class JobDescriptionResolver {
  constructor(private readonly jobDescriptionService: JobDescriptionService) {}

  @Query(() => ParsedJobDescription)
  async getParsedJobDescription(@Args('jobUrl') jobUrl: string): Promise<ParsedJobDescription> {
    return this.jobDescriptionService.parseJobDescription(jobUrl);
  }

  @Query(() => String)
  async getJobDescriptionContent(@Args('jobUrl') jobUrl: string): Promise<string> {
    return this.jobDescriptionService.getJobDescriptionHtml(jobUrl);
  }
}
