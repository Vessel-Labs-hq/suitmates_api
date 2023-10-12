import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestHeadersEnum } from 'src/enums/base.enum';

import { ErrorHelper } from '../utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();

    let authorization: string;
    if (!req.headers) {
      authorization = req.handshake.headers[RequestHeadersEnum.Authorization];
    } else {
      authorization = req.headers[RequestHeadersEnum.Authorization];
    }

    if (!authorization) {
      ErrorHelper.UnauthorizedException('Authorization header is missing');
    }

    const user = await this.verifyAccessToken(authorization);

    req.user = user;
    return true;
  }

  async verifyAccessToken(authorization: string) {
    const [bearer, accessToken] = authorization.split(' ');

    if (bearer !== 'Bearer') {
      ErrorHelper.UnauthorizedException('Authorization should be Bearer');
    }

    if (!accessToken) {
      ErrorHelper.UnauthorizedException('Access token is missing');
    }

    try {
      const payload = this.jwtService.verify(accessToken);

      const user = payload;

      if (!user) {
        ErrorHelper.UnauthorizedException('Unauthorized Exception');
      }

      return user;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        ErrorHelper.UnauthorizedException('Token expired');
      }

      ErrorHelper.UnauthorizedException(error.message);
    }
  }
}
