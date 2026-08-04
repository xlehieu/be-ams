import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/auth.dto';
import { UserPayloadSign } from '@/@types/auth.type';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existUser = await this.usersService.findOne({
      where: { email: registerDto.email },
    });
    if (existUser) {
      throw new ConflictException(
        'Email đã tồn tại, vui lòng sử dụng email khác',
      );
    }
    const createdUser = await this.usersService.create(registerDto);
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);
    createdUser.password_hash = passwordHash;
    return this.usersService.update(createdUser.id, {
      password_hash: passwordHash,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne({
      where: { email },
    });
    const paswordMatch = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;
    if (user && paswordMatch) {
      const { password_hash, ...result } = user;
      return result;
    }
    throw new NotFoundException('Email hoặc mật khẩu không đúng');
  }
  async login(user: User) {
    const payload: UserPayloadSign = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async getProfile(userId: number) {
    const user = await this.usersService.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    // instance của User => tự bỏ password_hash
    return user;
  }
}
