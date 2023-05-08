import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Post } from 'src/posts/entities/post';


@Module({
  //
  imports: [TypeOrmModule.forFeature([User, Post, Profile])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
