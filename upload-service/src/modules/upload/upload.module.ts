import { Module } from '@nestjs/common';
import { GoogleDriveModule, GoogleDriveService } from '../google-drive';
import { UploadProviderFactory } from './upload-provider.factory';
import { UploadController } from './upload.controller';

@Module({
  imports: [GoogleDriveModule],
  controllers: [UploadController],
  providers: [UploadProviderFactory, GoogleDriveService],
})
export class UploadModule {}
