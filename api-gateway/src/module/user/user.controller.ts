import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-account')
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.userService.createAccount(createAccountDto);
  }
}
