import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtConfigInterface, BaseAuthPayload } from 'packages';

@Injectable()
export class JwtService {
  constructor(
    protected readonly nestJwtService: NestJwtService,
    protected readonly configService: ConfigService,
  ) {}

  async generateToken<T extends BaseAuthPayload>(
    payload: T,
    config: JwtConfigInterface,
  ): Promise<string> {
    return this.nestJwtService.sign(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    });
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
