import { Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcExceptionInterface } from './exception';
import { Observable, of } from 'rxjs';
import { BaseExceptionInterface } from 'packages';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<BaseExceptionInterface> {
    const response = exception.getError() as RpcExceptionInterface;
    const errorResponse: BaseExceptionInterface = {
      message: response.message,
      error: response.name,
      statusCode: response.status,
      isError: true,
    };
    return of(errorResponse);
  }
}
