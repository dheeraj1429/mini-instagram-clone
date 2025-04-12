import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { CreateVideoSegmentsRequestInterface } from 'packages/shared';

export class CreateVideoSegmentsDto
  implements CreateVideoSegmentsRequestInterface
{
  @IsString()
  @IsNotEmpty()
  readonly path: string;

  @IsString()
  @IsNotEmpty()
  readonly folder: string;

  @IsString()
  @IsNotEmpty()
  readonly filename: string;
}

export class RunCommandDto {
  @IsString()
  @IsNotEmpty()
  cmd: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsDefined({ each: true })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  args: string[];
}
