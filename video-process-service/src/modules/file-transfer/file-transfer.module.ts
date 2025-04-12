import { Module } from '@nestjs/common';
import { FileTransferService } from './file-transfer.service';

@Module({
  providers: [FileTransferService],
})
export class FileTransferModule {}
