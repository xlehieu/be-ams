import { Compare } from "@/decorators/compare.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message: "Email không được để trống" })
    @IsEmail({}, { message: "Email không hợp lệ" })
    @ApiProperty({example:"user@example.com"})
    email: string;

    @IsNotEmpty({ message: "Mật khẩu không được để trống" })
    @MinLength(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
    @ApiProperty({example:"123456"})
    password: string;
}

export class RegisterDto {
    @IsNotEmpty({ message: "Email không được để trống" })
    @IsEmail({}, { message: "Email không hợp lệ" })
    @ApiProperty({example: "user@example.com"})
    email: string;

    @IsNotEmpty({ message: "Mật khẩu không được để trống" })
    @MinLength(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
     @ApiProperty({example: "123456"})
    password: string;

    @IsNotEmpty({ message: "Xác nhận mật khẩu không được để trống" })
    @MinLength(6, { message: "Xác nhận mật khẩu phải có ít nhất 6 ký tự" })
    @Compare("password", "confirm_password")
    @ApiProperty({example: "123456"})
    confirm_password: string;

    @IsNotEmpty({ message: "Tên không được để trống" })
    @ApiProperty({example: "Hieu"})
    name: string;

    @IsNotEmpty({ message: "ID phòng ban không được để trống" })
    @ApiProperty({example: 1})
    department_id: number;

    @IsNotEmpty({ message: "Mã nhân viên không được để trống" })
    @ApiProperty({example: "NV-001"})
    employee_code: string;
}