import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Post } from 'src/posts/entities/post';
import { UsernameUniqueness } from 'src/users/validators/isUserUnique';


@Module({
  //
  imports: [TypeOrmModule.forFeature([User, Post, Profile])],
  controllers: [UsersController],
  providers: [UsersService, UsernameUniqueness],
})
export class UsersModule {}
