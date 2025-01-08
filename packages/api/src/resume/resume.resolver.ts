import { Args, Query, Resolver } from '@nestjs/graphql';
import { ResumeService } from './resume.service';
import { ResumePipe } from './resume.pipe';
import { Resume } from './resume.model';

@Resolver(() => Resume)
export class ResumeResolver {
  constructor(private readonly resumeService: ResumeService) {}

  @Query(() => Resume)
  async getResume(@Args('resume', { type: () => String }, ResumePipe) resume: Resume): Promise<Resume> {
    return resume;
  }
}
