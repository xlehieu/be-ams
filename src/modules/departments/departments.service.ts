import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { CurrentUserType } from '@/@types/auth.type';
import { USER_ROLE } from '@/enums/user-role.enum';
import { UsersService } from '../users/users.service';
import { ListQueryDto } from '@/shared/query.dto';
import { buildPagination } from '@/shared/buildPagination';
import { buildAndWhereQueryBuilder } from '@/common/typeorm/query-builder';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    private readonly userService: UsersService,
  ) {}
  create(createDepartmentDto: CreateDepartmentDto) {
    return this.departmentRepository.save(createDepartmentDto);
  }

  async findAll(query: ListQueryDto) {
    const qb = buildAndWhereQueryBuilder(this.departmentRepository,{
      alias:"department",
      queryList:[{
        key:["name","department_code"],
        operatorCf:"ilike",
        paramName:"keyword",
        value:query.keyword
      }]
    })
    qb.orderBy('department.updated_at', 'DESC')
      .addOrderBy('department.id', 'DESC')
      .skip(query.offset)
      .take(query.page_size);
    const [data, total] = await qb.getManyAndCount();
    return buildPagination(data, total, query.page, query.page_size);
  }

  // findOne(id: number) {
  //   return this.departmentRepository.findOne({ where: { id } });
  // }
  async findById(id: number, curUser: CurrentUserType) {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: {
        users: true,
      },
      select: {
        id: true,
        name: true,
        department_code: true,
        users: {
          id: true,
          name: true,
        },
      },
    });
    if (!department) {
      throw new NotFoundException('Không tìm thấy phòng ban');
    }
    if (curUser.role === USER_ROLE.ADMIN) {
      return department;
    }
    if (curUser.department_id !== department?.id) {
      throw new ForbiddenException('Không có quyền truy cập');
    }
    return department;
  }
  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const result = await this.departmentRepository.update(
      id,
      updateDepartmentDto,
    );
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return await this.departmentRepository.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: number) {
    const result = await this.departmentRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return {
      message: 'Xóa phòng ban thành công',
    };
  }

  async restore(id: number) {
    const result = await this.departmentRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return {
      message: 'Khôi phục phòng ban thành công',
    };
  }
}
