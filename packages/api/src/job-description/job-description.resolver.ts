import { Args, Query, Resolver } from '@nestjs/graphql';
import { JobDescriptionService } from './job-description.service';
import { ParsedJobDescription } from './job-description.dto';

@Resolver(() => ParsedJobDescription)
export class JobDescriptionResolver {
  constructor(private readonly jobDescriptionService: JobDescriptionService) {}

  @Query(() => ParsedJobDescription)
  async getParsedJobDescription(@Args('jobUrl') jobUrl: string): Promise<ParsedJobDescription> {
    return this.jobDescriptionService.parseJobDescription(jobUrl);
  }
}
