import { Module } from '@nestjs/common';
import { TranscodingController } from './transcoding.controller';
import { TranscodingService } from './transcoding.service';
import { FileTransferModule, FileTransferService } from '../file-transfer';

@Module({
  imports: [FileTransferModule],
  controllers: [TranscodingController],
  providers: [TranscodingService, FileTransferService],
})
export class TranscodingModule {}
