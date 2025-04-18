import {
  Catch,
  ExceptionFilter,
  BadRequestException as NestBadRequestException,
} from '@nestjs/common';
import { BaseExceptionInterface } from 'packages';
import { Observable, of } from 'rxjs';
import { BadRequestExceptionInterface } from './exception';

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
