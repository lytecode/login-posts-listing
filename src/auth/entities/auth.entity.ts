import { Post } from "src/posts/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('auth')
export class Auth {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: '' })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    hashRt: string;

    @OneToMany(() => Post, (post) => post.author, { cascade: true })
    posts: Post[];
}