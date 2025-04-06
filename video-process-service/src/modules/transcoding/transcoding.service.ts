import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { spawn } from 'child_process';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TranscodingService {
  private readonly logger = new Logger(TranscodingService.name);

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
  ): Promise<string> {
    try {
      const response = await axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
      });

      const disposition = response.headers['content-disposition'];
      let fileName = 'unknown-file';

      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="(.+?)"/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }

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

  async transcoding(data: any) {
    const UPLOADED_VIDEO_BUNDLE_ID = uuidv4();
    const outputFilePath = `/usr/src/outputs/${UPLOADED_VIDEO_BUNDLE_ID}`;

    await this.createDirectory(outputFilePath);

    const downloadedFilePath = await this.downloadFile(
      data.postVideoUrl,
      outputFilePath,
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
