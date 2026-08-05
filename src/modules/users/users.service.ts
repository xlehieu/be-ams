// users/users.service.ts
import type { CurrentUserType } from '@/@types/auth.type';
import { USER_ROLE } from '@/enums/user-role.enum';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto, curUser: CurrentUserType) {
    if (
      createUserDto.role === USER_ROLE.ADMIN &&
      curUser.role !== USER_ROLE.ADMIN
    ) {
      throw new ForbiddenException('Không có quyền thực hiện');
    }
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(options: FindOneOptions<User>,) {    
    return this.userRepository.findOne(options);
  }

  async findById(id: number, curUser: CurrentUserType) {
    if (curUser.role === USER_ROLE.USER && curUser.id !== id) {
      throw new ForbiddenException();
    }
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User với id ${id} không tồn tại`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, curUser: CurrentUserType) {
    if (curUser.role === USER_ROLE.USER && curUser.id !== id) {
      throw new ForbiddenException();
    }
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id,curUser);
  }

  async remove(id: number) {
    const result = await this.userRepository.softDelete(id);
    if(result.affected===0){
      throw new NotFoundException()
    }
    return {
      message:"Xóa user thành công"
    }
  }
}
