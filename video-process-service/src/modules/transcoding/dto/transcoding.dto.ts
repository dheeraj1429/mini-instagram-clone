import { IsNotEmpty, IsString } from 'class-validator';
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
