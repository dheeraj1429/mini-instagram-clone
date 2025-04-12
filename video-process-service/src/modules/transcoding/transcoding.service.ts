import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import { FileTransferService } from '../file-transfer';
import { CreateVideoSegmentsDto, RunCommandDto } from './dto';

@Injectable()
export class TranscodingService {
  private readonly logger = new Logger(TranscodingService.name);

  constructor(private readonly fileTransferService: FileTransferService) {}

  private async runCommand(runCommandDto: RunCommandDto): Promise<void> {
    const { cmd, args } = runCommandDto;

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
    try {
      const outputFilePath = `/usr/src/outputs/${createVideoSegments.folder}`;
      await this.fileTransferService.createDirectory(outputFilePath);

      const downloadedFilePath = await this.fileTransferService.downloadFile({
        fileUrl: createVideoSegments.path,
        filePath: outputFilePath,
        fileName: createVideoSegments.filename,
      });

      const segmentsPath = path.join(outputFilePath, 'segments');

      await this.fileTransferService.createDirectory(segmentsPath);
      await this.runCommand({
        cmd: 'ffmpeg',
        args: [
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
        ],
      });

      const filesPath = await this.fileTransferService.getAllFiles({
        folderPath: segmentsPath,
      });

      await Promise.all(
        filesPath.map((path) => {
          return this.fileTransferService.uploadFile({
            filePath: path,
            suffixPath: `folderPath=${createVideoSegments.folder}`,
          });
        }),
      );

      await this.fileTransferService.removeDir(outputFilePath);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
