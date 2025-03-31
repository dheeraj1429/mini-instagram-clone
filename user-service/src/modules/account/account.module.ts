import { Module } from '@nestjs/common';
import { DatabaseModule } from 'mini-instagram-packages';
import { AccountCommandHandlers } from './commands';
import { AccountCommandController } from './controllers';
import { AccountCommandRepository } from './repository';
import { Account, AccountSchema } from './schema';
import { AccountCommandService } from './services';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            port: configService.get<number>('AUTH_SERVICE_PORT'),
            host: configService.get<string>('AUTH_SERVICE_HOST'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AccountCommandController],
  providers: [
    ...AccountCommandHandlers,
    AccountCommandService,
    AccountCommandRepository,
  ],
})
export class AccountModule {}
