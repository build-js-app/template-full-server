import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';

import {Category} from './category';
import {User} from './user';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column('double')
  cost: number;

  @Column('text')
  note: string;

  @ManyToOne(type => Category, category => category.id)
  category: Category;

  @ManyToOne(type => User, user => user.id)
  user: User;
}
