import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { spawn } from 'child_process';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { CreateVideoSegmentsDto } from './dto';

@Injectable()
export class TranscodingService {
  private readonly logger = new Logger(TranscodingService.name);

  constructor(private readonly configService: ConfigService) {}

  private async createDirectory(dir: string) {
    try {
      await fsPromises.mkdir(dir, { recursive: true });
      this.logger.log(`Directory created: ${dir}`);
    } catch (error) {
      throw error;
    }
  }

  private async downloadFile(
    fileUrl: string,
    filePath: string,
    fileName: string,
  ): Promise<string> {
    try {
      const downloadFileUrl = `${this.configService.get<string>('CUSTOM_STORAGE_URL')}${fileUrl}`;

      const response = await axios({
        method: 'get',
        url: downloadFileUrl,
        responseType: 'stream',
      });

      const finalFilePath = path.join(filePath, fileName);

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

  private async runCommand(cmd: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn(cmd, args);

      process.stderr.on('data', (data) => {
        this.logger.log(`stderr: ${data.toString()}`);
      });

      process.on('error', (err) => {
        this.logger.error('FFmpeg process error:', err);
        reject(err);
      });

      process.on('close', (code: number) => {
        if (code === 0) {
          this.logger.log('FFmpeg process completed successfully.');
          resolve();
        } else {
          const error = new Error(`FFmpeg process exited with code ${code}`);
          this.logger.error(error.message);
          reject(error);
        }
      });

      process.stdin.end();
    });
  }

  async createVideoSegments(createVideoSegments: CreateVideoSegmentsDto) {
    const outputFilePath = `/usr/src/outputs/${createVideoSegments.folder}`;
    await this.createDirectory(outputFilePath);

    const downloadedFilePath = await this.downloadFile(
      createVideoSegments.path,
      outputFilePath,
      createVideoSegments.filename,
    );

    const segmentsPath = path.join(outputFilePath, 'segments');
    await this.createDirectory(segmentsPath);
    this.runCommand('ffmpeg', [
      '-i',
      downloadedFilePath,
      '-codec:v',
      'libx264',
      '-codec:a',
      'aac',
      '-hls_time',
      '10',
      '-hls_playlist_type',
      'vod',
      `-hls_segment_filename`,
      path.join(segmentsPath, 'segment%03d.ts'),
      '-start_number',
      '0',
      path.join(segmentsPath, 'index.m3u8'),
    ]);
  }
}
