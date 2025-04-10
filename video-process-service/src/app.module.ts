import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TranscodingModule } from './modules';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        HOST: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        CUSTOM_STORAGE_URL: Joi.string().required(),
      }),
    }),
    TranscodingModule,
  ],
})
export class AppModule {}
