import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDepartmentDto {
    @IsNotEmpty({ message: "Tên phòng ban không được để trống" })
    @IsString({ message: "Tên phòng ban phải là một chuỗi" })
    @ApiProperty({ description: "Tên phòng ban", example: "Phòng Kinh Doanh" })
    name: string;

    @IsNotEmpty({ message: "Mã phòng ban không được để trống" })
    @IsString({ message: "Mã phòng ban phải là một chuỗi" })
    @ApiProperty({ description: "Mã phòng ban", example: "KD-001" })
    department_code: string;

    @IsOptional()
    @IsString({ message: "Mã phòng ban cha phải là một chuỗi" })
    parent_id?: string;
}
