import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TranscodingModule } from './modules';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TranscodingModule],
})
export class AppModule {}
