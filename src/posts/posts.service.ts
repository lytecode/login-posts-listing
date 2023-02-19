import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>
  ) { }

  async create(createPostDto: CreatePostDto, userId: string) {
    const post = new Post();
    post.title = createPostDto.title
    post.body = createPostDto.body;

    const author = await this.authRepository.findOneBy({ id: userId });
    post.author = author;
    const { author: { id, name, email }, ...rest } = await this.postsRepository.save(post);

    return { ...rest, author: { id, name, email } };
  }

  async findAll() {
    const results = await this.postsRepository.find({
      relations: {
        author: true
      }
    });

    const posts = results.map(({ id, title, body, author }) => ({
      id, title, body,
      author: {
        id: author.id,
        email: author.email,
        name: author.name
      }
    }));

    return posts
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.preload({ id, ...updatePostDto });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return this.postsRepository.save(post);
  }

  async remove(id: number) {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} does not exist`);
    }
    return this.postsRepository.remove(post);
  }
}
