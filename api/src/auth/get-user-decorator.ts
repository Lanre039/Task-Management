import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "./user.entity";


// export const GetUser = createParamDecorator((data, req): User => {
//     console.log(req);
//     return req.user;
// });
export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  });
