import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AccountModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        HOST: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
      }),
    }),
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
