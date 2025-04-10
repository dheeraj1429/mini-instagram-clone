import { IsNotEmpty, IsString } from 'class-validator';

export class UploadPostDto {
  @IsString()
  @IsNotEmpty()
  readonly caption: string;
}
