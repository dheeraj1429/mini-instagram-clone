import { Body, Controller, Post } from '@nestjs/common';
import { TranscodingService } from './transcoding.service';

@Controller('convert')
export class TranscodingController {
  constructor(private readonly transcodingService: TranscodingService) {}

  @Post('transcoding')
  async transcoding(@Body() data: unknown) {
    return this.transcodingService.transcoding(data);
  }
}
