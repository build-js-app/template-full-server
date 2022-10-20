import {Model, ModelCtor} from 'sequelize';

interface UserInstance extends Model {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profile: any;
}

export type UserModel = ModelCtor<UserInstance>;
