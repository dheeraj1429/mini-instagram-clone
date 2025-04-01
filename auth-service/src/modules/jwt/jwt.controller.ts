import { Controller, Logger } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { AUTH_EVENTS } from 'packages';
import { MessagePattern } from '@nestjs/microservices';
import { GenerateTokenDto, ValidateTokenDto } from './dto';

@Controller()
export class JwtController {
  private readonly logger = new Logger(JwtController.name);

  constructor(private readonly jwtService: JwtService) {}

  @MessagePattern(AUTH_EVENTS.GENERATE_TOKEN)
  async generateToken(generateTokenDto: GenerateTokenDto) {
    return this.jwtService.generateToken(generateTokenDto);
  }

  @MessagePattern(AUTH_EVENTS.VALIDATE_TOKEN)
  async validateToken(validateTokenDto: ValidateTokenDto) {
    return this.jwtService.validate(
      validateTokenDto.token,
      this.jwtService.deriveSecretByTokenType(validateTokenDto.type),
    );
  }
}
