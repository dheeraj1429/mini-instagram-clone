import {
  BaseAuthPayload,
  JwtConfigInterface,
  TokenType,
} from '../jwt.interface';

export interface GenerateTokenRequestInterface<T> extends JwtConfigInterface {
  type: TokenType;
  payload: BaseAuthPayload & T;
}
