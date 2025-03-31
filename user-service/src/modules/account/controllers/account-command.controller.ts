import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';
import { USER_EVENTS } from 'packages';
import { CreateAccountCommand } from '../commands';
import { CreateAccountDto } from '../dto';

@Controller()
export class AccountCommandController {
  private logger = new Logger(AccountCommandController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern(USER_EVENTS.USER_CREATE)
  async createAccount(createAccountDto: CreateAccountDto) {
    return this.commandBus.execute(new CreateAccountCommand(createAccountDto));
  }
}
