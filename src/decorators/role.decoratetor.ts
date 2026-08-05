
import { USER_ROLE } from '@/enums/user-role.enum';
import { SetMetadata } from '@nestjs/common';


export const ROLES_KEY = 'roles';
export const ALL_ROLES = 'ALL_ROLES' as const;
export const Roles = (...roles: (USER_ROLE|typeof ALL_ROLES)[]) => SetMetadata(ROLES_KEY, roles);
