import { Inject, Injectable, Logger } from '@nestjs/common';
import { UploadProviderFactory } from './upload-provider.factory';
import { UploadPostDto } from './dto';
import {
  VIDEO_TRANSCODING_EVENTS,
  CreateVideoSegmentsRequestInterface,
} from 'mini-instagram-video-process-service-package';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UploadService {
  constructor(
    private readonly uploadProviderFactory: UploadProviderFactory,
    @Inject('VIDEO_PROCESS_SERVICE')
    private readonly videoProcessService: ClientProxy,
  ) {}

  async uploadPost(file: Express.Multer.File, uploadPostDto: UploadPostDto) {
    try {
      const uploader = this.uploadProviderFactory.getProvider('customStorage');
      const uploadedVideo = await uploader.uploadFile(file);
      this.videoProcessService.emit<void, CreateVideoSegmentsRequestInterface>(
        VIDEO_TRANSCODING_EVENTS.CREATE_VIDEO_SEGMENTS,
        uploadedVideo,
      );
    } catch (error) {
      throw error;
    }
  }
}
