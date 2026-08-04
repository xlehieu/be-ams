// users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(options: FindOneOptions<User>) {
    return this.userRepository.findOne(options);
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where:{id}
    });
    if (!user) {
      throw new NotFoundException(`User với id ${id} không tồn tại`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async remove(id: number) {
    await this.findById(id); // check tồn tại trước khi xóa, tự throw nếu không có
    return this.userRepository.delete(id);
  }
}