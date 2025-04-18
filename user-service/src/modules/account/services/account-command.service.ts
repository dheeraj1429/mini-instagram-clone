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
import {
  AUTH_EVENTS,
  GenerateTokenRequestInterface,
  GenerateTokenResponse,
} from 'mini-instagram-auth-service-package';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AccountCommandService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    private readonly accountCommandRepository: AccountCommandRepository,
  ) {}

  async createAccount(
    createAccountDto: CreateAccountDto,
  ): Promise<CreateAccountResponseInterface> {
    try {
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

      const tokenPayload = {
        _id: String(user._id),
      };

      const generateAccessToken = await firstValueFrom(
        this.authService.send<
          GenerateTokenResponse,
          GenerateTokenRequestInterface<unknown>
        >(AUTH_EVENTS.GENERATE_TOKEN, {
          type: 'access',
          payload: tokenPayload,
          expiresIn: '5m',
        }),
      );

      if (generateAccessToken.isError) {
        return generateAccessToken;
      }

      const generateRefreshToken = await firstValueFrom(
        this.authService.send<
          GenerateTokenResponse,
          GenerateTokenRequestInterface<unknown>
        >(AUTH_EVENTS.GENERATE_TOKEN, {
          type: 'access',
          payload: tokenPayload,
          expiresIn: '5m',
        }),
      );

      if (generateRefreshToken.isError) {
        return generateRefreshToken;
      }

      const successAccessTokenResponse = generateAccessToken as Exclude<
        GenerateTokenResponse,
        { isError: true }
      >;

      const successRefreshTokenResponse = generateAccessToken as Exclude<
        GenerateTokenResponse,
        { isError: true }
      >;

      return {
        userId: String(user._id),
        name,
        email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        accessToken: successAccessTokenResponse.token,
        refreshToken: successRefreshTokenResponse.token,
        isError: false,
      };
    } catch (error) {
      console.error('Error in createAccount:', error);
      throw error;
    }
  }
}
