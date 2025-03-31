import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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

  await app.listen();
  console.log(`Auth service listening on port ${port} host ${host}`);
}
bootstrap();
