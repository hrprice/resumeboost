import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resume } from './resume.model';

@Injectable()
export class ResumePipe implements PipeTransform {
  constructor(@InjectModel(Resume.name) private readonly resumeModel: Model<Resume>) {}
  async transform(resumeId: string): Promise<Resume | null> {
    const document = await this.resumeModel.findById(resumeId).catch(() => {
      throw new NotFoundException();
    });
    if (!document) throw new NotFoundException();
    return document;
  }
}
