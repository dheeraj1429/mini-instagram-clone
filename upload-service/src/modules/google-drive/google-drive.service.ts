import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Readable } from 'stream';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { v4 as uuidv4 } from 'uuid';
import { UploadProvider } from '../upload/interfaces/upload-provider.interface';
import * as config from './config/google-drive-config.json';

@Injectable()
export class GoogleDriveService implements UploadProvider {
  private readonly SCOPE = ['https://www.googleapis.com/auth/drive'];
  private readonly parents = ['1TbgA2uoJJijESVxlYaMNvNO2kS9LeRtO'];

  private readonly randomNameConfig = {
    dictionaries: [adjectives, colors, animals],
    separator: '-',
    seed: 120498,
  };

  constructor() {}

  private async authorize() {
    const jwtClient = new google.auth.JWT(
      config.client_email,
      null,
      config.private_key,
      this.SCOPE,
    );
    await jwtClient.authorize();
    return jwtClient;
  }

  private bufferToStream(file: Express.Multer.File) {
    const stream = Readable.from(file.buffer);
    return stream;
  }

  private async getDriveService() {
    const auth = await this.authorize();
    const DRIVE_VERSION = 'v3';
    return google.drive({ version: DRIVE_VERSION, auth });
  }

  async getFileURL(fileId: string) {
    const drive = await this.getDriveService();

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const result = await drive.files.get({
      fileId,
      fields: 'webViewLink, webContentLink',
    });

    const fileUrl = result.data.webContentLink;

    return fileUrl;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const driveService = await this.getDriveService();

      const fileName =
        file.fieldname ?? uniqueNamesGenerator(this.randomNameConfig);

      const response = await driveService.files.create({
        requestBody: {
          name: `${fileName}-${uuidv4()}`,
          parents: this.parents,
        },
        media: {
          mimeType: file.mimetype,
          body: this.bufferToStream(file),
        },
        fields: 'id',
      });

      const { id: fileId } = response.data;

      return await this.getFileURL(fileId);
    } catch (err) {
      throw err;
    }
  }
}
