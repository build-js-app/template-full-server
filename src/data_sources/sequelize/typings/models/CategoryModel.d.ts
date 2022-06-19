import {Model, ModelCtor} from 'sequelize';

interface CategoryInstane extends Model {
  id: number;
  title: string;
  description: string;
  userId: number;
}

export type CategoryModel = ModelCtor<CategoryInstane>;
