import { Module } from '@nestjs/common';
import { CustomStorageModule, CustomStorageService } from '../custom-storage';
import { UploadProviderFactory } from './upload-provider.factory';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CustomStorageModule,
    ClientsModule.registerAsync([
      {
        name: 'VIDEO_PROCESS_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            port: configService.get<number>('VIDEO_PROCESS_SERVICE_PORT'),
            host: configService.get<string>('VIDEO_PROCESS_SERVICE_HOST'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UploadController],
  providers: [UploadProviderFactory, CustomStorageService, UploadService],
})
export class UploadModule {}
