import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtController } from './jwt.controller';
import { JwtService } from './jwt.service';

@Module({
  imports: [NestJwtModule],
  controllers: [JwtController],
  providers: [JwtService],
})
export class JwtModule {}
