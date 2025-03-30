import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { CreateAccountRequestInterface } from 'mini-instagram-user-service-package';

export class CreateAccountDto implements CreateAccountRequestInterface {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  readonly password: string;

  @IsStrongPassword()
  @IsNotEmpty()
  readonly confirmPassword: string;
}
