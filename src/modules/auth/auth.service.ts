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
import { CurrentUserType } from '@/@types/auth.type';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RedisService } from '../redis/redis.service';
import { CACHE_SCOPE } from '@/shared/cache-scope.const';
import { ProducerService } from '../kafka/producer.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly producerService: ProducerService
  ) {}

  async register(registerDto: RegisterDto,curUser:CurrentUserType) {
    const existUser = await this.usersService.findOne({
      where: { email: registerDto.email },
    });
    if (existUser) {
      throw new ConflictException(
        'Email đã tồn tại, vui lòng sử dụng email khác',
      );
    }
    const saltRounds = this.configService.get<string>("SALT_BCRYPT") as string;
    const password_hash = await bcrypt.hash(registerDto.password, Number(saltRounds));
    const newUser:CreateUserDto ={
      ...registerDto,
      password_hash      
    } 
    const createdUser = await this.usersService.create(newUser,curUser);
    this.producerService.produce({
      topic:"register-success",
      messages: [
        { value: JSON.stringify(createdUser) },
      ],
    })
    return createdUser
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne({
      where: { email },
    });
    if(!user) throw new NotFoundException('Email hoặc mật khẩu không đúng');
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
    const payload: CurrentUserType = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async getProfile(userId: number) {
    const cache = await this.redisService.get(CACHE_SCOPE.AUTH,`profile:${userId}`)
    if(cache){
      return cache
    }
    const result = await this.usersService.findOne({
      where: { id: userId },
    });
    if (!result) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    const {password_hash,...user}=result
    await this.redisService.set(CACHE_SCOPE.AUTH,`profile:${userId}`,user)
    // instance của User => tự bỏ password_hash đã dùng ở main.ts
    return user;
  }
}
