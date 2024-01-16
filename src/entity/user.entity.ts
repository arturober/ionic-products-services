import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';
import { Product } from './product.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({length: 150})
    name: string;

    @Column({length: 150, unique: true})
    email: string;

    @Column({length: 150, nullable: true, select: false})
    password: string;

    @Column({length: 100, default: 'img/profile.jpg'})
    avatar: string;

    @Column({length: 500, nullable: true})
    firebaseToken: string;

    @OneToMany(type => Product, prod => prod.creator)
    productsCreated: Product[];

    @OneToMany(type => Comment, com => com.user)
    comments: Comment[];
}
