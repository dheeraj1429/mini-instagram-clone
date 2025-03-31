import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { hash } from 'bcryptjs';
import { CreateAccountResponseInterface } from 'packages/dist';
import { CreateAccountDto } from '../dto';
import { AccountCommandRepository } from '../repository';
import { AUTH_EVENTS } from 'mini-instagram-auth-service-package';

@Injectable()
export class AccountCommandService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    private readonly accountCommandRepository: AccountCommandRepository,
  ) {}

  async createAccount(
    createAccountDto: CreateAccountDto,
  ): Promise<CreateAccountResponseInterface> {
    this.authService.emit(AUTH_EVENTS.GENERATE_TOKEN, {});
    return {};

    // const { name, email, password, confirmPassword } = createAccountDto;

    // if (password != confirmPassword) {
    //   throw new RpcException(
    //     new BadRequestException('Password and confirm password do not match'),
    //   );
    // }

    // const isEmailAlreadyExist = await this.accountCommandRepository.findOne(
    //   { email },
    //   { email: 1 },
    // );

    // if (isEmailAlreadyExist) {
    //   throw new RpcException(new ConflictException('Email already exists'));
    // }

    // const hashPassword = await hash(password, 10);

    // const user = await this.accountCommandRepository.create({
    //   email,
    //   name,
    //   password: hashPassword,
    // });

    // return {
    //   userId: String(user._id),
    //   name,
    //   email,
    //   createdAt: user.createdAt,
    //   updatedAt: user.updatedAt,
    //   accessToken: 'abc',
    //   refreshToken: 'abc',
    //   isError: false,
    // };
  }
}
