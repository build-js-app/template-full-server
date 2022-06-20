import {Model, ModelCtor} from 'sequelize';

interface RecordInstance extends Model {
  id: number;
  categoryId: number;
  date: Date;
  cost: number;
  note: string;
  userId: number;
}

export type RecordModel = ModelCtor<RecordInstance>;
