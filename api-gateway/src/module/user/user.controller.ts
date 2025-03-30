import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateAccountDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-account')
  async createAccount(@Body() createAccountDto: unknown) {
    return this.userService.createAccount(createAccountDto);
  }
}
