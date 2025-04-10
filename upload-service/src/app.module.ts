import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UploadModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        CUSTOM_STORAGE_URL: Joi.string().required(),
        VIDEO_PROCESS_SERVICE_PORT: Joi.string().required(),
        VIDEO_PROCESS_SERVICE_HOST: Joi.string().required(),
      }),
    }),
    UploadModule,
  ],
})
export class AppModule {}
