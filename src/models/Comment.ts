import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Image } from './Image';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  comment: string;

  @ManyToOne(() => Image, image => image.comments)
  image: Image;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  constructor(text: string, file: Image) {

    this.comment = text;
    this.image = file; 
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}