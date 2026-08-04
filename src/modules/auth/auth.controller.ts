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
import { CurrentUser } from '@/decorators/currentUser.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
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
