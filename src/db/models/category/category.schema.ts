import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import slugify from 'slugify';
import cloudinary from 'src/common/config/cloud.config';

export interface IImage {
  secure_url: string;
  public_id: string;
}

@Schema({ timestamps: true, versionKey: false })
export class Category {
  @Prop({ type: String, required: true, unique: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  folderId: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    default: function () {
      return slugify(this.name);
    },
  })
  slug: string;

  @Prop({ type: { secure_url: String, public_id: String } })
  image: IImage;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const categorySchema = SchemaFactory.createForClass(Category);

categorySchema.pre('deleteOne', async function (next) {
  const filter = this.getFilter();
  const category = await this.model.findOne(filter);

  if (category) {
    await cloudinary.api.delete_resources_by_prefix(
      `e-commerce/${category.folderId}`,
    );
    await cloudinary.api.delete_folder(`e-commerce/${category.folderId}`);
  }
  next();
});

export type TCategory = Category & Document;
