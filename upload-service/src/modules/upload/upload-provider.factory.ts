import { Injectable } from '@nestjs/common';
import { CustomStorageService } from '../custom-storage';
import {
  UploadProvider,
  UploadProviderType,
} from './interfaces/upload-provider.interface';

@Injectable()
export class UploadProviderFactory {
  constructor(private readonly customStorage: CustomStorageService) {}

  getProvider(provider: UploadProviderType = 'customStorage'): UploadProvider {
    switch (provider) {
      case 'customStorage':
        return this.customStorage;
      default:
        throw new Error('Unsupported provider');
    }
  }
}
