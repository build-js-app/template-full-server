import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne} from 'typeorm';

import {Record} from './record';
import {User} from './user';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 100})
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(type => User, user => user.id)
  user: User;

  @OneToMany(type => Record, record => record.id)
  records: Record[];
}
