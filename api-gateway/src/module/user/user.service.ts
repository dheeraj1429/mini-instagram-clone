import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateAccountResponseInterface,
  USER_EVENTS,
} from 'mini-instagram-user-service-package';
import { CreateAccountDto } from './dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto) {
    try {
      const response = await firstValueFrom(
        this.userService.send<CreateAccountResponseInterface, CreateAccountDto>(
          USER_EVENTS.USER_CREATE,
          createAccountDto,
        ),
      );
      if (response.isError) {
        return response;
      }
      const successResponse = response as Exclude<
        CreateAccountResponseInterface,
        { isError: true }
      >;
      return successResponse;
    } catch (error) {
      console.error('Error in createAccount:', error);
      throw error;
    }
  }
}
