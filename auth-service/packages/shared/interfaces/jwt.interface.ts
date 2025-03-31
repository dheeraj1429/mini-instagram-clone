export interface JwtConfigInterface {
  secret: string;
  expiresIn: number | string;
}
export interface BaseAuthPayload {
  _id: string;
}

export type TokenType = 'access' | 'refresh';
