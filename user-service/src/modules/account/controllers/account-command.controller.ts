import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { USER_EVENTS } from 'packages';
import { CreateAccountDto } from '../dto';

@Controller()
export class AccountCommandController {
  private logger = new Logger(AccountCommandController.name);

  @MessagePattern(USER_EVENTS.USER_CREATE)
  async createAccount(createAccountDto: CreateAccountDto) {
    this.logger.log('create account request');
    return {};
  }
}
