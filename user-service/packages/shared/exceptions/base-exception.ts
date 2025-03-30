import { HttpStatus } from '@nestjs/common';

export enum ERROR_CODES {
  BAD_REQUEST_EXCEPTION = 'BAD_REQUEST_EXCEPTION',
}

export interface BaseExceptionInterface {
  message: string | string[];
  error: string;
  statusCode: `${HttpStatus}`;
  type: `${ERROR_CODES}`;
}

export type GenericException<T> =
  | ({ isError: true } & BaseExceptionInterface)
  | ({ isError: false } & T);
