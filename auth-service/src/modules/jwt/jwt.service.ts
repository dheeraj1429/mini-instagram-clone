import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { BaseAuthPayload, GenerateTokenResponse, TokenType } from 'packages';
import { GenerateTokenDto } from './dto';

@Injectable()
export class JwtService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  private deriveSecretByTokenType(type: TokenType): string {
    switch (type) {
      case 'access':
        return this.configService.get<string>('ACCESS_TOKEN_SECRET');
      case 'refresh':
        return this.configService.get<string>('REFRESH_TOKEN_SECRET');
    }
  }

  async generateToken(
    generateTokenDto: GenerateTokenDto,
  ): Promise<GenerateTokenResponse> {
    const { payload, type, expiresIn } = generateTokenDto;

    const secret = this.deriveSecretByTokenType(type);
    const token = this.nestJwtService.sign(payload, { secret, expiresIn });

    return { token, isError: false };
  }

  async getToken(request: Request): Promise<string> {
    const authorization = request.headers['authorization'];
    if (!authorization) throw new UnauthorizedException();
    const token = authorization.split(' ');
    if (token.length !== 2)
      throw new UnauthorizedException('Please provide valid token.');
    return token[1];
  }

  async validate(token: string, secret: string): Promise<BaseAuthPayload> {
    try {
      const tokenPayload = this.nestJwtService.verify<BaseAuthPayload>(token, {
        secret,
      });
      if (!tokenPayload) throw new ForbiddenException('Token expire');
      return tokenPayload;
    } catch (err) {
      throw new ForbiddenException('Invalid token');
    }
  }

  async decode(
    token: string,
  ): Promise<BaseAuthPayload & { iat: number; exp: number }> {
    try {
      return this.nestJwtService.decode(token);
    } catch (err) {
      throw new ForbiddenException('Invalid token');
    }
  }
}
