import { Roles } from '@/decorators/role.decoratetor';
import { USER_ROLE } from '@/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu hash không được để trống' })
  @IsString({ message: 'Mật khẩu phải hash là một chuỗi' })
  password_hash: string;

  @IsNotEmpty({ message: 'Tên không được để trống' })
  @ApiProperty({ example: 'Hieu' })
  @IsString({ message: 'Tên phải là một chuỗi' })
  name: string;

  @IsNotEmpty({ message: 'ID phòng ban không được để trống' })
  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: 'department_id phải là một số' })
  department_id: number;

  @IsNotEmpty({ message: 'Mã nhân viên không được để trống' })
  @ApiProperty({ example: 'NV-001' })
  @IsString({ message: 'Mã nhân viên phải là một chuỗi' })
  employee_code: string;

  @IsOptional()
  @IsEnum(Roles)

  @IsOptional()
  @IsEnum(USER_ROLE, {
    message: 'Quyền user',
  })
  role?: USER_ROLE;
}
