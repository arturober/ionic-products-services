import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column('varchar', { length: 200 })
  description: string;

  @Column('varchar', { length: 200 })
  imageUrl: string;

  @Column('smallint', {default: 0})
  rating: number;

  @Column('decimal', {precision: 8, scale: 2})
  price: number;

  @Column('datetime', {default: () => 'CURRENT_TIMESTAMP'})
  available: Date;

  @ManyToOne(type => User, user => user.productsCreated, {nullable: false, cascade: true, onDelete: 'CASCADE'})
  creator: User;

  @OneToMany(type => Comment, com => com.product)
  comments: Comment[];
}
