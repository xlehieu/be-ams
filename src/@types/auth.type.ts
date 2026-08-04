import { UserRole } from '@/enums/user-role.enum';

export type UserPayloadSign = { email: string; id: number; role: UserRole };
