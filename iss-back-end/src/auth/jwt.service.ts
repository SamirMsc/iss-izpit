import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secret: string;

  constructor(private configService: ConfigService) {
    this.secret = this.configService.get<string>('JWT_SECRET');
  }

  sign(payload: any, options?: any): string {
    return sign(payload, this.secret, options);
  }

  verify(token: string): any {
    return verify(token, this.secret);
  }
}
