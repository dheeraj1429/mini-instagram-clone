import { Injectable, Logger } from '@nestjs/common';
import {
  UploadFileResponse,
  UploadProvider,
} from '../upload/interfaces/upload-provider.interface';
import axios from 'axios';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

@Injectable()
export class CustomStorageService implements UploadProvider {
  private readonly logger = new Logger(CustomStorageService.name);

  constructor(private readonly configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File): Promise<UploadFileResponse> {
    const form = new FormData();
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await axios.post<UploadFileResponse>(
      `${this.configService.get<string>('CUSTOM_STORAGE_URL')}/upload?folderPath=${v4()}`,
      form,
    );

    return response.data;
  }
}
