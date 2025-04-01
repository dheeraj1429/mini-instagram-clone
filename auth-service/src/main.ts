import { BadRequestException, RpcExceptionFilter } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const ctx = await NestFactory.createApplicationContext(AppModule);
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
  console.log(`Auth service listening on port ${port} host ${host}`);
}
bootstrap();
