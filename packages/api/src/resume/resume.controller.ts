import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { AuthGuard } from '../auth/auth.guard';
import { ResumePipe } from './resume.pipe';
import { Resume } from './resume.model';

@UseGuards(AuthGuard)
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadResume(@UploadedFile() file: Express.Multer.File, @Body('textContent') textContent: string) {
    const currentResumes = await this.resumeService.getAllResumes();
    await Promise.all(currentResumes?.map(({ _id }) => this.resumeService.deleteResume(_id)));
    return await this.resumeService.uploadResume(file, JSON.parse(textContent));
  }

  @Get(':resume')
  async getResumeFile(@Param('resume', ResumePipe) resume: Resume): Promise<StreamableFile> {
    const buffer = await this.resumeService.getResumeFile(resume);
    return new StreamableFile(buffer, {
      type: resume.mimeType,
      disposition: `attachment; filename="${resume.fileName}"`
    });
  }
}
