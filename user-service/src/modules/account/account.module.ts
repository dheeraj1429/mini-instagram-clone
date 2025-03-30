import { Module } from '@nestjs/common';
import { AccountCommandController } from './controllers';
import { AccountCommandHandlers } from './commands';

@Module({
  controllers: [AccountCommandController],
  providers: [...AccountCommandHandlers],
})
export class AccountModule {}
