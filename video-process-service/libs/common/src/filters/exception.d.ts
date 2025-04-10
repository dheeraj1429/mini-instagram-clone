import { HttpStatus } from '@nestjs/common';
import { BaseExceptionInterface } from 'packages';

export interface BadRequestExceptionInterface extends BaseExceptionInterface {}

export interface RpcExceptionInterface {
  status: `${HttpStatus}`;
  message: string;
  options: object;
  name: string;
}
