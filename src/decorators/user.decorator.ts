import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  id: number;
  role: string;
  verified: boolean;
  onboarded: boolean;
  avatar: string;
  bio: string;
}

export const User = createParamDecorator<any, any, IUser>(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;

    return user as IUser;
  },
);
