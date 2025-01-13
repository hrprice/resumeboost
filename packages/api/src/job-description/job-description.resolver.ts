import { Args, Query, Resolver } from '@nestjs/graphql';
import { JobDescriptionService } from './job-description.service';
import { JobDescription } from './job-description.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Resolver(() => JobDescription)
export class JobDescriptionResolver {
  constructor(private readonly jobDescriptionService: JobDescriptionService) {}

  @Query(() => JobDescription)
  async getParsedJobDescription(@Args('jobUrl') jobUrl: string): Promise<JobDescription> {
    return this.jobDescriptionService.parseJobDescription(jobUrl);
  }

  @Query(() => String)
  async getJobDescriptionContent(@Args('jobUrl') jobUrl: string): Promise<string> {
    return this.jobDescriptionService.getJobDescriptionHtml(jobUrl);
  }
}
