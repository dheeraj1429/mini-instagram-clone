import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateAccountDto } from '../dto';
import { AccountCommandRepository } from '../repository';
import { RpcException } from '@nestjs/microservices';
import { hash } from 'bcryptjs';
import { CreateAccountResponseInterface } from 'packages/dist';

@Injectable()
export class AccountCommandService {
  constructor(
    private readonly accountCommandRepository: AccountCommandRepository,
  ) {}

  async createAccount(
    createAccountDto: CreateAccountDto,
  ): Promise<CreateAccountResponseInterface> {
    const { name, email, password, confirmPassword } = createAccountDto;

    if (password != confirmPassword) {
      throw new RpcException(
        new BadRequestException('Password and confirm password do not match'),
      );
    }

    const isEmailAlreadyExist = await this.accountCommandRepository.findOne(
      { email },
      { email: 1 },
    );

    if (isEmailAlreadyExist) {
      throw new RpcException(new ConflictException('Email already exists'));
    }

    const hashPassword = await hash(password, 10);

    const user = await this.accountCommandRepository.create({
      email,
      name,
      password: hashPassword,
    });

    return {
      userId: String(user._id),
      name,
      email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      accessToken: 'abc',
      refreshToken: 'abc',
      isError: false,
    };
  }
}
