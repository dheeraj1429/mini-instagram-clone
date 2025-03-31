import {
  Catch,
  ExceptionFilter,
  BadRequestException as NestBadRequestException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { BadRequestExceptionInterface } from './exception';
import { BaseExceptionInterface } from 'packages';

@Catch(NestBadRequestException)
export class BadRequestException
  implements ExceptionFilter<NestBadRequestException>
{
  catch(
    exception: NestBadRequestException,
  ): Observable<BaseExceptionInterface> {
    const response = exception.getResponse() as BadRequestExceptionInterface;
    return of({
      ...response,
      isError: true,
    });
  }
}
