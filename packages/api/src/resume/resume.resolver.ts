import { Args, Query, Resolver } from '@nestjs/graphql';
import { ResumeService } from './resume.service';
import { ResumePipe } from './resume.pipe';
import { Resume } from './resume.model';

@Resolver(() => String)
export class ResumeResolver {
  constructor(private readonly resumeService: ResumeService) {}

  @Query(() => String)
  async getResumeText(@Args('resume', { type: () => String }, ResumePipe) resume: Resume): Promise<string> {
    return this.resumeService.parseResumeText(resume);
  }
}
