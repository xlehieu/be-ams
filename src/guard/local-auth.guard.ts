
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// dùng LocalAuthGuard đã extends thay vì dùng @AuthGuard('ams-login')
export class LocalAuthGuard extends AuthGuard('ams-login') {}
