import { Compare } from '@/decorators/compare.decorator';
import { USER_ROLE } from '@/enums/user-role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @ApiProperty({ example: '123456' })
  @IsString({ message: 'Mật khẩu phải là một chuỗi' })
  password: string;
}

export class RegisterDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsString({ message: 'Mật khẩu phải là một chuỗi' })
  @ApiProperty({ example: '123456' })
  password: string;

  @IsNotEmpty({ message: 'Xác nhận mật khẩu không được để trống' })
  @MinLength(6, { message: 'Xác nhận mật khẩu phải có ít nhất 6 ký tự' })
  @Compare('password',{message:"Mật khẩu và xác nhận mật khẩu phải giống nhau"})
  @IsString({ message: 'Xác nhận mật khẩu phải là một chuỗi' })
  @ApiProperty({ example: '123456' })
  confirm_password: string;

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

  @ApiPropertyOptional({
    enum: USER_ROLE,
    enumName: 'USER_ROLE',
    description: 'Quyền của người dùng',
  })
  @IsOptional()
  @IsEnum(USER_ROLE, {
    message: 'Quyền user',
  })
  role?: USER_ROLE;
}
