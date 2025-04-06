import { Module } from '@nestjs/common';
import { TranscodingController } from './transcoding.controller';
import { TranscodingService } from './transcoding.service';

@Module({
  controllers: [TranscodingController],
  providers: [TranscodingService],
})
export class TranscodingModule {}
