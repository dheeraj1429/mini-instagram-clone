import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'mini-instagram-packages';

@Schema({ versionKey: false, collection: 'users', timestamps: true })
export class Account extends AbstractDocument {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
