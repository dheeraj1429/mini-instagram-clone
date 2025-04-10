import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadPostDto } from './dto';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('post')
  @UseInterceptors(FileInterceptor('post-video'))
  async uploadPost(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadPostDto: UploadPostDto,
  ) {
    return this.uploadService.uploadPost(file, uploadPostDto);
  }
}
