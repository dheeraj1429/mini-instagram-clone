import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BadRequestException, RpcExceptionFilter } from '@app/common';

async function bootstrap() {
  const ctx = await NestFactory.create(AppModule);
  const configService = ctx.get(ConfigService);

  const port = configService.get<number>('PORT');
  const host = configService.get<string>('HOST');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { port, host },
    },
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new BadRequestException(), new RpcExceptionFilter());

  await app.listen();
  console.log(`Video process service started on port ${port} host ${host}`);
}
bootstrap();
