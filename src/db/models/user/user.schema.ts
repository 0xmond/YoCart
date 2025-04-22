import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRolesEnum } from 'src/common/enums';

interface IOtp {
  code: string;
  otpType: string;
  expiresIn: Date;
}

// schema class
@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Boolean, default: false })
  isConfirmed: boolean;

  @Prop({
    type: String,
    enum: UserRolesEnum,
    required: true,
    default: UserRolesEnum.user,
  })
  role: string;

  @Prop({
    type: [
      {
        code: { type: String },
        otpType: { type: String },
        expiresIn: { type: Date },
      },
    ],
  })
  otp: IOtp[];
}

// schema
export const userSchema = SchemaFactory.createForClass(User);

// type
export type TUser = HydratedDocument<User> & Document;
