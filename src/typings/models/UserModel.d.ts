import {Model, ModelCtor} from 'sequelize';

interface UserInstance extends Model {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dataValues: any;
  profile: any;
}

export type UserModel = ModelCtor<UserInstance>;
