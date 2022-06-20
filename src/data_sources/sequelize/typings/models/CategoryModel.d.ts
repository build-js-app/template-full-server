import {Model, ModelCtor} from 'sequelize';

interface CategoryInstance extends Model {
  id: number;
  title: string;
  description: string;
  userId: number;
}

export type CategoryModel = ModelCtor<CategoryInstance>;
