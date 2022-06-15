import {Schema, Types, model, Document} from 'mongoose';

interface IRecord extends Document {
  id: string;
  date: Date;
  cost: number;
  note: string;
  categoryId: Types.ObjectId;
  userId: Types.ObjectId;
}

const recordSchema = new Schema<IRecord>({
  date: {
    type: Date,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category'
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

export const RecordModel = model<IRecord>('Record', recordSchema);
