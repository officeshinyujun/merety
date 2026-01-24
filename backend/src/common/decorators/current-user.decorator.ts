import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../entities';

/**
 * 현재 요청의 인증된 사용자를 가져오는 데코레이터
 * @example
 * @Get('me')
 * getMe(@CurrentUser() user: User) { return user; }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext): User | unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    // 특정 필드만 요청한 경우
    if (data) {
      return user?.[data];
    }

    return user;
  },
);
