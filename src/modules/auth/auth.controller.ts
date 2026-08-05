import { Public } from '@/decorators/public.decoratetor';
import { LocalAuthGuard } from '@/guard/local-auth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ApiBody } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '@/decorators/currentUser.decorator';
import type { CurrentUserType } from '@/@types/auth.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto,@CurrentUser() curUser:CurrentUserType) {
    return this.authService.register(registerDto,curUser);
  }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  login(@CurrentUser() user:User) {
    return this.authService.login(user);
  }
  // @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user:User) {
    return this.authService.getProfile(user.id);
  }
}
