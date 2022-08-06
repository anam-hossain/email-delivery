import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const EmailServiceDecorator = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.emailService) {
      return null;
    }

    return request.emailService;
  },
);
