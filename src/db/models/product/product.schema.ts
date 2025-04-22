import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Category, IImage } from '../category/category.schema';
import slugify from 'slugify';
import { User } from '../user/user.schema';
import cloudinary from 'src/common/config/cloud.config';

@Schema({ timestamps: true, versionKey: false })
export class Product {
  // string
  @Prop({ type: String, required: true, trim: true })
  title: string;
  @Prop({
    type: String,
    default: function () {
      return slugify(this.title);
    },
  })
  slug: string;
  @Prop({ type: String, required: true, trim: true })
  description: string;

  // object id
  @Prop({ type: Types.ObjectId, required: true, ref: Category.name })
  category: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  createdBy: Types.ObjectId;
  @Prop({
    type: Types.ObjectId,
    default: function () {
      return this.createdBy;
    },
    ref: User.name,
  })
  updatedBy: Types.ObjectId;

  // number
  @Prop({ type: Number, required: true, min: 1 })
  price: number;
  @Prop({ type: Number, required: true, min: 0, max: 100 }) // --> Percentage ✅
  discount: number;
  @Prop({
    type: Number,
    default: function () {
      return this.price - (this.discount / 100) * this.price;
    },
  })
  finalPrice: number;
  @Prop({ type: Number, default: 1, min: 0 })
  stock: number;

  // image
  @Prop({ type: [{ secure_url: String, public_id: String }] })
  images: IImage[];
  @Prop({ type: String })
  folderId: string;
}

export const productSchema = SchemaFactory.createForClass(Product);

productSchema.pre('deleteOne', async function (next) {
  const filter = this.getFilter();
  const product = await this.model.findOne(filter);

  if (product) {
    await cloudinary.api.delete_resources_by_prefix(
      `e-commerce/${product.folderId}`,
    );
    await cloudinary.api.delete_folder(`e-commerce/${product.folderId}`);
  }

  next();
});

productSchema.pre('deleteMany', async function (next) {
  const { category } = this.getFilter();
  const products = await this.model.find({ category });
  for (const product of products) {
    await cloudinary.api.delete_resources_by_prefix(
      `e-commerce/${product.folderId}`,
    );
    await cloudinary.api.delete_folder(`e-commerce/${product.folderId}`);
  }
  next();
});

export type TProduct = HydratedDocument<Product> & Document;
