import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const USERS_COLLECTION = 'users';

@Schema({ _id: false, versionKey: false })
export class AvatarMongo {
  @Prop({ type: String, required: true })
  storageKey!: string;

  @Prop({ type: String, required: true })
  srcUrl!: string;
}

export const AvatarSchema = SchemaFactory.createForClass(AvatarMongo);

@Schema({ collection: USERS_COLLECTION, versionKey: false })
export class UserMongo {
  @Prop({ type: String })
  _id!: string;

  @Prop({ type: String, required: true })
  email!: string;

  @Prop({ type: String, required: true })
  firstName!: string;

  @Prop({ type: String, default: '' })
  lastName!: string;

  @Prop({ type: AvatarSchema, default: null })
  avatar!: AvatarMongo | null;

  @Prop({ type: String, required: true })
  passwordHash!: string;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

export type UserDocument = HydratedDocument<UserMongo>;

export const UserSchema = SchemaFactory.createForClass(UserMongo);

UserSchema.index({ email: 1 }, { unique: true });
