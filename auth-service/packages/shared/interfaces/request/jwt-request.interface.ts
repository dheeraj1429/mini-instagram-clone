import {
  BaseAuthPayload,
  JwtConfigInterface,
  TokenType,
} from '../jwt.interface';

export interface GenerateTokenRequestInterface<T>
  extends Omit<JwtConfigInterface, 'secret'> {
  type: TokenType;
  payload: BaseAuthPayload & T;
}

export interface ValidateTokenRequestInterface {
  type: TokenType;
  token: string;
}
