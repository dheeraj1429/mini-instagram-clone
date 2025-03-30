import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { CreateAccountInterface } from 'mini-instagram-user-service-package';

export class CreateAccountDto implements CreateAccountInterface {
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
