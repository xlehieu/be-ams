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
import { RedisService } from '../redis/redis.service';
import { CACHE_SCOPE } from '@/shared/cache-scope.const';
import { ListQueryDto } from '@/shared/query.dto';
import { ListQueryUsers } from './dto/query-user.dto';
import {
  buildAndWhereQueryBuilder,
  QueryBuilderConfigItem,
} from '@/common/typeorm/query-builder';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
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

  findAll(query: ListQueryUsers, curUser: CurrentUserType) {
    const queryList: QueryBuilderConfigItem[] = [];
    // manager phòng ban nào xem phòng ban đấy
    if (curUser.role === USER_ROLE.MANAGER) {
      queryList.push({
        key: 'department_id',
        operatorCf: 'eq',
        paramName: 'department_id',
        value: curUser.department_id,
      });
    } else if (curUser.role === USER_ROLE.ADMIN) {
      queryList.push({
        key: 'department_id',
        operatorCf: 'eq',
        paramName: 'department_id',
        value: query.department_id,
      });
    }
    const qb = buildAndWhereQueryBuilder(this.userRepository, {
      alias: 'user',
      queryList: [
        ...queryList,
        {
          key: ['name', 'employee_code', 'email'],
          operatorCf: 'ilike',
          paramName: 'keyword',
          value: query.keyword,
        },
      ],
    });
    qb.orderBy('user.updated_at', 'DESC')
      .addOrderBy('user.id', 'DESC')
      .skip(query.offset)
      .take(query.page_size);
    return this.userRepository.find();
  }

  async findOne(options: FindOneOptions<User>) {
    return this.userRepository.findOne(options);
  }

  async findById(id: number, curUser: CurrentUserType) {
    if (curUser.role === USER_ROLE.USER && curUser.id !== id) {
      throw new ForbiddenException();
    }
    const cacheKey = [User.name, 'detail', id];
    const cache = await this.redisService.get<User>(cacheKey);
    if (cache) {
      return cache;
    }
    const result = await this.userRepository.findOne({
      where: { id },
      relations: {
        department: true,
      },
    });
    if (!result) {
      throw new NotFoundException(`User không tồn tại`);
    }
    const { password_hash, ...user } = result;
    await this.redisService.set(cacheKey, user);
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    curUser: CurrentUserType,
  ) {
    if (
      (curUser.role === USER_ROLE.USER && curUser.id !== id) ||
      updateUserDto.role === USER_ROLE.ADMIN ||
      (updateUserDto.role === USER_ROLE.MANAGER &&
        curUser.role === USER_ROLE.USER)
    ) {
      throw new ForbiddenException();
    }

    const user = await this.findById(id, curUser);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    await this.redisService.bumpVersionScope([User.name, 'detail', id]);
    return user;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException();
    } else if (user.role === USER_ROLE.ADMIN) {
      throw new ForbiddenException();
    }
    await this.userRepository.softDelete(id);
    return {
      message: 'Xóa user thành công',
    };
  }
}
