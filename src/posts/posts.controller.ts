import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post(':id')
  create(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(id, createPostDto);
    }
  
}
