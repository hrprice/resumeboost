import { Args, Query, Resolver } from '@nestjs/graphql';
import { ResumePipe } from './resume.pipe';
import { Resume } from './resume.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ResumeService } from './resume.service';

@UseGuards(AuthGuard)
@Resolver(() => Resume)
export class ResumeResolver {
  constructor(private readonly resumeService: ResumeService) {}
  @Query(() => Resume)
  async getResume(@Args('resume', { type: () => String }, ResumePipe) resume: Resume): Promise<Resume> {
    return resume;
  }

  @Query(() => [Resume])
  async getAllResumes() {
    return this.resumeService.getAllResumes();
  }
}
