import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DownloadFileDto {
  @IsString()
  @IsNotEmpty()
  readonly fileUrl: string;

  @IsString()
  @IsNotEmpty()
  readonly filePath: string;

  @IsString()
  @IsNotEmpty()
  readonly fileName: string;
}

export class GetAllFilesDto {
  @IsString()
  @IsNotEmpty()
  readonly folderPath: string;
}

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  readonly filePath: string;

  @IsString()
  @IsOptional()
  readonly suffixPath?: string;
}
