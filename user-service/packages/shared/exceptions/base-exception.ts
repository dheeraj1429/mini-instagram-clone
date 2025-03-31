import { HttpStatus } from '@nestjs/common';

export interface BaseExceptionInterface {
  message: string | string[];
  error: string;
  statusCode: `${HttpStatus}`;
  isError: true;
}

export type GenericException<T> =
  | BaseExceptionInterface
  | ({ isError: false } & T);
