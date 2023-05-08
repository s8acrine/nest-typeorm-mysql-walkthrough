import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { Profile } from './profiles/entities/profile.entity';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/entities/post';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'testuser',
    password: 'testuser123',
    database: 'nestjs_mysql_tutorial',
    entities: [User, Profile, Post],
    synchronize: true
  }), UsersModule, ProfilesModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
