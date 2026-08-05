import { USER_ROLE } from '@/enums/user-role.enum';

export type CurrentUserType = { email: string; id: number; role: USER_ROLE };
