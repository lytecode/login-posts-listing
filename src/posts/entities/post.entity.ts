import { Auth } from "src/auth/entities/auth.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    body: string;

    @ManyToOne(() => Auth, (author) => author.posts)
    author: Auth;
}
