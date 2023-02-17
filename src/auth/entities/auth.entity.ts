// import { Post } from "src/posts/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('auth')
export class Auth {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    hashRt: string;

    // @OneToMany(() => Post, (post) => post.author, { cascade: true })
    // posts: Post[];
}