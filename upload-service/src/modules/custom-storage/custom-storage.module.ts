import { Module } from '@nestjs/common';
import { CustomStorageService } from './custom-storage.service';

@Module({
  providers: [CustomStorageService],
})
export class CustomStorageModule {}
