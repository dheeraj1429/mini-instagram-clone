import { Module } from '@nestjs/common';
import { DatabaseModule } from 'mini-instagram-packages';
import { AccountCommandHandlers } from './commands';
import { AccountCommandController } from './controllers';
import { AccountCommandRepository } from './repository';
import { Account, AccountSchema } from './schema';
import { AccountCommandService } from './services';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  controllers: [AccountCommandController],
  providers: [
    ...AccountCommandHandlers,
    AccountCommandService,
    AccountCommandRepository,
  ],
})
export class AccountModule {}
