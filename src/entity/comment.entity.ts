import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({length: 1000})
    text: string;

    @CreateDateColumn({type: 'datetime'})
    date: Date;

    @ManyToOne(type => Product, prod => prod.comments, {nullable: false, cascade: true, onDelete: 'CASCADE'})
    product: Product;

    @ManyToOne(type => User, user => user.comments, {nullable: false, cascade: true, onDelete: 'CASCADE'})
    user: User;
}
