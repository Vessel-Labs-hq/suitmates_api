import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { RequestHeadersEnum } from 'src/enums/base.enum';

import { ErrorHelper } from '../utils';
// import { Request } from 'express';
// import { IUserTokenInfo } from 'src/types';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();

    console.log('::::::::::; req?.cookies?.token', {
      lsls: JSON.stringify(req?.cookies),
      lsl: JSON.stringify(req?.signedCookies),
    });
    if (!req?.cookies) {
      ErrorHelper.UnauthorizedException('Cookie header is missing');
    }

    const authorization: string = req?.cookies?.token;
    if (!authorization) {
      ErrorHelper.UnauthorizedException('Authorization token is missing');
    }

    const user = await this.verifyAccessToken(authorization);
    console.log('::::::::::; user', user);

    Object.assign(req, { user });

    console.log('::::::::::; req.user', req.user);
    return true;
  }

  async verifyAccessToken(accessToken: string) {
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
