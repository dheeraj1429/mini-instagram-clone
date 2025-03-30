import { BaseExceptionInterface } from 'packages';

export interface BadRequestExceptionInterface
  extends Omit<BaseExceptionInterface, 'type'> {}
