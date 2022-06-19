import {Schema, Types, model, Document} from 'mongoose';

interface ICategory extends Document {
  id: string;
  title: string;
  description: string;
  userId: Types.ObjectId;
}

const categorySchema: Schema = new Schema<ICategory>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

export const CategoryModel = model<ICategory>('Category', categorySchema);