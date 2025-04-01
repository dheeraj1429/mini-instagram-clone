import { Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { BaseExceptionInterface } from 'packages';
import { Observable, of } from 'rxjs';
import { RpcExceptionInterface } from './exception';

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
