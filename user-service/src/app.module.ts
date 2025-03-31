import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import * as Joi from 'joi';
import { AccountModule } from './modules';
import { DatabaseModule } from 'mini-instagram-packages';

@Module({
  imports: [
    DatabaseModule,
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        HOST: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
