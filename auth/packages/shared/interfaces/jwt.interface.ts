export interface JwtConfigInterface {
  secret: string;
  expiresIn: number | string;
}
export interface UserTokenPayloadInterface {
  _id: string;
}

export type TokenType = 'access' | 'refresh';
