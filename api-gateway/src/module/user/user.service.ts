import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_EVENTS } from 'mini-instagram-user-service-package';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  async createAccount(createAccountDto: unknown) {
    this.userService.emit(USER_EVENTS.USER_CREATE, createAccountDto);
  }
}
