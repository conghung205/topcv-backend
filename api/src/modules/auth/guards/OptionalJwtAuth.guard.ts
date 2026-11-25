import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AccessTokenPayload, OptionalAuthenticatedRequest } from '../type';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<OptionalAuthenticatedRequest>();

    const authorization = request.headers.authorization;
    if (!authorization) {
      return true;
    }

    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    try {
      request.user =
        await this.jwtService.verifyAsync<AccessTokenPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    return true;
  }
}
