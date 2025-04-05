import { Injectable } from '@nestjs/common';
import { GoogleDriveService } from '../google-drive';
import { UploadProvider } from './interfaces/upload-provider.interface';

@Injectable()
export class UploadProviderFactory {
  constructor(private googleDrive: GoogleDriveService) {}

  getProvider(provider: 'googleDrive'): UploadProvider {
    switch (provider) {
      case 'googleDrive':
        return this.googleDrive;
      default:
        throw new Error('Unsupported provider');
    }
  }
}
