import { Args, Query, Resolver } from '@nestjs/graphql';
import { ResumePipe } from './resume.pipe';
import { Resume } from './resume.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Resolver(() => Resume)
export class ResumeResolver {
  @Query(() => Resume)
  async getResume(@Args('resume', { type: () => String }, ResumePipe) resume: Resume): Promise<Resume> {
    return resume;
  }
}
