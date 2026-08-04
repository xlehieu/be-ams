import { UserPayloadSign } from "@/@types/auth.type";
import { User } from "@/modules/users/entities/user.entity";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator((data:keyof  UserPayloadSign| undefined,ctx:ExecutionContext)=>{
    const request = ctx.switchToHttp().getRequest();
    const user:User = request.user;
    return data ? user?.[data] : user;
})

