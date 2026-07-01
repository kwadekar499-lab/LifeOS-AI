import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
  sub: string;
  email?: string;
  username?: string;
  role?: string;
}

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as JwtPayload;
  return user?.sub;
});
