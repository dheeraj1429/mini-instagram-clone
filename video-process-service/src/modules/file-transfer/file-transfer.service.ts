import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import * as fs from 'fs';
import { DownloadFileDto, GetAllFilesDto, UploadFileDto } from './dto';
import { promises as fsPromises } from 'fs';
import * as FormData from 'form-data';

@Injectable()
export class FileTransferService {
  private readonly logger = new Logger(FileTransferService.name);

  constructor(private readonly configService: ConfigService) {}

  async createDirectory(dir: string) {
    try {
      await fsPromises.mkdir(dir, { recursive: true });
      this.logger.log(`Directory created: ${dir}`);
    } catch (error) {
      throw error;
    }
  }

  async removeDir(dir: string) {
    try {
      await fsPromises.rm(dir, { force: true, recursive: true });
      this.logger.log(`Directory removed: ${dir}`);
    } catch (error) {
      throw error;
    }
  }

  async downloadFile(downloadFileDto: DownloadFileDto): Promise<string> {
    try {
      const downloadFileUrl = `${this.configService.get<string>('CUSTOM_STORAGE_URL')}${downloadFileDto.fileUrl}`;

      const response = await axios({
        method: 'get',
        url: downloadFileUrl,
        responseType: 'stream',
      });

      const finalFilePath = path.join(
        downloadFileDto.filePath,
        downloadFileDto.fileName,
      );

      await promisify(pipeline)(
        response.data,
        fs.createWriteStream(finalFilePath),
      );

      this.logger.log(`Download complete: ${finalFilePath}`);
      return finalFilePath;
    } catch (error) {
      this.logger.error(`Download failed: ${error.message}`);
      throw error;
    }
  }

  async getAllFiles(getAllFilesDto: GetAllFilesDto): Promise<string[]> {
    try {
      return fs
        .readdirSync(getAllFilesDto.folderPath)
        .map((file) => path.join(getAllFilesDto.folderPath, file));
    } catch (err) {
      throw err;
    }
  }

  async uploadFile(uploadFileDto: UploadFileDto) {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(uploadFileDto.filePath));

      const urlSuffixPath = uploadFileDto?.suffixPath ?? 'folderPath=test';
      const url = `${this.configService.get<string>('CUSTOM_STORAGE_URL')}/upload?${urlSuffixPath}`;
      this.logger.log(url);
      await axios.post(url, formData);
      this.logger.log(`Segments upload success url: ${url}`);
    } catch (err) {
      throw err;
    }
  }
}
