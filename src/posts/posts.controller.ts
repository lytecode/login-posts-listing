import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/auth/common/decorators';

@Controller('/api/v1/posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetCurrentUserId() userId: string) {
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  findAll(@GetCurrentUserId() userId: string) {
    return this.postsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @GetCurrentUserId() userId: string) {
    return this.postsService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto, @GetCurrentUserId() userId: string) {
    return this.postsService.update(id, updatePostDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number, @GetCurrentUserId() userId: string) {
    return this.postsService.remove(id, userId);
  }
}
