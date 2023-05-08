import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user';
import { CreatePostParams } from 'src/utils/types';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async create(id: number, createPostDetails: CreatePostParams) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user)
      throw new HttpException(
        'User not found',
        HttpStatus.BAD_REQUEST
      )
    const newPost = this.postRepository.create({
      ...createPostDetails,
      createdAt: new Date(),
      user,
    })
    return this.postRepository.save(newPost)
  }
}
