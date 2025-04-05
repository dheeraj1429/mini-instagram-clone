import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadProviderFactory } from './upload-provider.factory';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadProviderFactory: UploadProviderFactory) {}

  @Post('post')
  @UseInterceptors(FileInterceptor('post-video'))
  async uploadPost(@UploadedFile() file: Express.Multer.File): Promise<string> {
    const uploader = this.uploadProviderFactory.getProvider('googleDrive');
    return uploader.uploadFile(file);
  }
}
