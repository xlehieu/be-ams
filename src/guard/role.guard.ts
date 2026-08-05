
import { ALL_ROLES, ROLES_KEY } from '@/decorators/role.decoratetor';
import { USER_ROLE } from '@/enums/user-role.enum';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<(USER_ROLE | typeof ALL_ROLES)[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    // lấy từ request guard verify token
    const { user } = context.switchToHttp().getRequest();
    if(requiredRoles.includes(ALL_ROLES)) return true
    return requiredRoles.some((role) => user.role === role);
  }
}
