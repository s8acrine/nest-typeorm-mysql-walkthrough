import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Post } from 'src/posts/entities/post';
import { IsUserUniqueConstraint } from 'src/utils/validators/';


@Module({
  //
  imports: [TypeOrmModule.forFeature([User, Post, Profile])],
  controllers: [UsersController],
  providers: [UsersService, IsUserUniqueConstraint],
})
export class UsersModule {}
