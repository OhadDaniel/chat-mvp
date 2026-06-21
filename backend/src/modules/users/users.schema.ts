import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const USERS_COLLECTION = 'users';

@Schema({ _id: false, versionKey: false })
export class AvatarDocument {
  @Prop({ type: String, required: true })
  storageKey!: string;

  @Prop({ type: String, required: true })
  srcUrl!: string;
}

export const AvatarSchema = SchemaFactory.createForClass(AvatarDocument);

@Schema({ collection: USERS_COLLECTION, versionKey: false })
export class UserDocument {
  @Prop({ type: String })
  _id!: string;

  @Prop({ type: String, required: true })
  email!: string;

  @Prop({ type: String, required: true })
  firstName!: string;

  @Prop({ type: String, default: '' })
  lastName!: string;

  @Prop({ type: AvatarSchema, default: null })
  avatar!: AvatarDocument | null;

  @Prop({ type: String, required: true })
  passwordHash!: string;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

UserSchema.index({ email: 1 }, { unique: true });
