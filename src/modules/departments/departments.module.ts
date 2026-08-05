import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  imports:[
    TypeOrmModule.forFeature([Department]),
    UsersModule
  ]
})
export class DepartmentsModule {}
