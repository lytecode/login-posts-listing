import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

type Pp = Omit<Post, 'author.password' | 'author.hashRt'>

// {
//   id: number;
//   title: string;
//   body: string;
//   author: {
//     id: string;
//     email: string;
//     name: string;
//   }
// }

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

  async findAll(userId: string) {
    const results = await this.postsRepository.find({
      relations: {
        author: true
      },
      where: {
        author: {
          id: userId
        }
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

    return posts;
  }

  async findOne(id: number, userId) {
    const post = await this.postsRepository.findOne({
      relations: ['author'],
      where: {
        id: id,
        author: {
          id: userId
        }
      }
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return ({ ...post, author: { id: post.author.id, name: post.author.name, email: post.author.email } })
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.findOne(id, userId);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    const postToUpdate = await this.postsRepository.preload({ id, ...updatePostDto });

    return this.postsRepository.save(postToUpdate);
  }

  async remove(id: number, userId: string) {
    const post = await this.postsRepository.findOne({
      relations: ['author'],
      where: {
        id,
        author: {
          id: userId
        }
      }
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} does not exist`);
    }
    return this.postsRepository.remove(post);
  }
}
