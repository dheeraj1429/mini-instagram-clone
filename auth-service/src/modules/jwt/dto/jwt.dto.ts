import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { GenerateTokenRequestInterface, TokenType } from 'packages';

export class GenerateTokenDto
  implements GenerateTokenRequestInterface<unknown>
{
  @IsIn(['access', 'refresh'], {
    message: 'type must be either "access" or "refresh"',
  })
  type: TokenType;

  @IsNotEmpty({ message: 'payload should not be empty' })
  payload: any;

  @ValidateIf((o) => typeof o.expiresIn === 'string')
  @IsString({ message: 'expiresIn must be a string when provided as a string' })
  @ValidateIf((o) => typeof o.expiresIn === 'number')
  @IsNumber(
    {},
    { message: 'expiresIn must be a number when provided as a number' },
  )
  @IsNotEmpty()
  expiresIn: string | number;
}
