import { Body, Controller } from '@nestjs/common';
import { CreateVideoSegmentsDto } from './dto';
import { TranscodingService } from './transcoding.service';
import { MessagePattern } from '@nestjs/microservices';
import { VIDEO_TRANSCODING_EVENTS } from 'packages/shared';

@Controller()
export class TranscodingController {
  constructor(private readonly transcodingService: TranscodingService) {}

  @MessagePattern(VIDEO_TRANSCODING_EVENTS.CREATE_VIDEO_SEGMENTS)
  async createVideoSegments(
    @Body() createVideoSegmentsDto: CreateVideoSegmentsDto,
  ) {
    return this.transcodingService.createVideoSegments(createVideoSegmentsDto);
  }
}
