import type { CurrentUserType } from '@/@types/auth.type';
import { CurrentUser } from '@/decorators/currentUser.decorator';
import { ALL_ROLES, Roles } from '@/decorators/role.decoratetor';
import { USER_ROLE } from '@/enums/user-role.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ListQueryDto } from '@/shared/query.dto';
import { ListQueryUsers } from './dto/query-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(USER_ROLE.ADMIN, USER_ROLE.MANAGER)
  create(
    @CurrentUser() curUser: CurrentUserType,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto, curUser);
  }

  @Get()
  @Roles(USER_ROLE.ADMIN, USER_ROLE.MANAGER)
  findAll(
    @Query() query: ListQueryUsers,
    @CurrentUser() curUser: CurrentUserType,
  ) {
    return this.usersService.findAll(query, curUser);
  }

  @Get(':id')
  findById(@Param('id') id: number, @CurrentUser() curUser: CurrentUserType) {
    return this.usersService.findById(id, curUser);
  }

  @Patch(':id')
  @Roles(ALL_ROLES)
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() curUser: CurrentUserType,
  ) {
    return this.usersService.update(id, updateUserDto, curUser);
  }

  @Delete(':id')
  @Roles(USER_ROLE.ADMIN)
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
