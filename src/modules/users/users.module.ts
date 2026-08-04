import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  controllers: [UsersController],
  // để mọi thứ trong providers để inject
  providers: [UsersService],
  imports:[TypeOrmModule.forFeature([User])],
  exports: [UsersService]
})
export class UsersModule {}
