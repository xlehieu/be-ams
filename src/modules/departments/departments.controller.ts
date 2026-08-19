import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ALL_ROLES, Roles } from '@/decorators/role.decoratetor';
import { USER_ROLE } from '@/enums/user-role.enum';
import { CurrentUser } from '@/decorators/currentUser.decorator';
import type { CurrentUserType } from '@/@types/auth.type';
import { ListQueryDto } from '@/shared/query.dto';

@Roles(USER_ROLE.ADMIN)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @Roles(USER_ROLE.ADMIN, USER_ROLE.MANAGER)
  async findAll(@Query() query: ListQueryDto) {
    const data = await this.departmentsService.findAll(query);
    return data;
  }

  @Get(':id')
  @Roles(ALL_ROLES)
  findById(@Param('id') id: number, @CurrentUser() curUser: CurrentUserType) {
    return this.departmentsService.findById(id, curUser);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.departmentsService.remove(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: number) {
    return this.departmentsService.restore(id);
  }
}
