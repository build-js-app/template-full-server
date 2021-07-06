import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';

import {Record} from './record';
import {Category} from './category';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'text', unique: true})
  note: string;

  @Column('json')
  profile: JSON; //local, google, facebook

  @OneToMany(type => Record, record => record.id)
  records: Record[];

  @OneToMany(type => Category, category => category.id)
  categories: Category[];
}
