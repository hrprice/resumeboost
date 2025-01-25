import { ACCEPTED_RESUME_FILE_TYPES } from '@resume-optimizer/shared/resume-constants';
import { MAX_RESUME_FILE_SIZE } from '@resume-optimizer/shared/resume-constants';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bucket, Storage } from '@google-cloud/storage';
import { InjectModel } from '@nestjs/mongoose';
import { Resume } from './resume.model';
import { LlmService } from '../llm/llm.service';
import { Model } from 'mongoose';
import { UnstructuredLoader } from '@langchain/community/document_loaders/fs/unstructured';
import { Context } from 'src/context/context.service';

@Injectable()
export class ResumeService {
  constructor(
    private readonly configService: ConfigService,
    private readonly llmService: LlmService,
    private readonly context: Context,
    @InjectModel(Resume.name) private resumeModel: Model<Resume>
  ) {}

  private bucket: Bucket;
  private bucketName: string;

  private getBucket(): Bucket {
    if (!this.bucket) {
      this.bucketName = this.configService.getOrThrow('GOOGLE_CLOUD_STORAGE_BUCKET');
      this.bucket = new Storage().bucket(this.bucketName);
    }
    return this.bucket;
  }

  async uploadResume(file: Express.Multer.File, textContent: string[]): Promise<string> {
    if (file.size > MAX_RESUME_FILE_SIZE) throw new BadRequestException('file size too large');
    if (!ACCEPTED_RESUME_FILE_TYPES.includes(file.mimetype))
      throw new BadRequestException(
        `Unsupported file type: ${file.mimetype}. Accepted types: ${ACCEPTED_RESUME_FILE_TYPES}`
      );
    const fileId = await this.resumeModel
      .create({
        fileName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        textContent,
        user: this.context.get('user')?._id.toString()
      })
      .then(({ _id }) => _id.toString())
      .catch(() => {
        throw new InternalServerErrorException();
      });

    const blob = this.getBucket().file(fileId);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.end(file.buffer);

    await new Promise((resolve, reject) => {
      blobStream.on('finish', resolve);
      blobStream.on('error', reject);
    }).catch(() => {
      throw new InternalServerErrorException();
    });

    return fileId;
  }

  async parseResumeTextOCR(resume: Resume): Promise<string> {
    const bucket = this.getBucket();
    const [buffer] = await bucket.file(resume._id.toString()).download();

    const loader = new UnstructuredLoader(
      { buffer, fileName: resume.fileName },
      {
        strategy: 'hi_res',
        apiKey: this.configService.getOrThrow('UNSTRUCTURED_API_KEY'),
        apiUrl: 'https://api.unstructuredapp.io/general/v0/general'
      }
    );
    const docs = await loader.load();

    return docs.map(({ pageContent }) => pageContent).join(' ');
  }

  async getAllResumes(userId?: string): Promise<Resume[]> {
    const id = userId || this.context.get('user')._id;
    if (!id) throw new InternalServerErrorException();
    return this.resumeModel
      .find({ user: { _id: id } })
      .populate('user')
      .exec();
  }

  async deleteResume(resumeId: string): Promise<void> {
    await this.resumeModel.deleteOne({ _id: resumeId });
    await this.getBucket().file(resumeId).delete();
  }

  async getResumeFile(resume: Resume): Promise<Buffer> {
    const { _id } = resume;
    const bucket = this.getBucket();
    const file = bucket.file(_id);
    const [buffer] = await file.download();
    return buffer;
  }
}
