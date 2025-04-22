import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Product } from '../product/product.schema';
import { User } from '../user/user.schema';

export interface ICartProduct {
  product: Types.ObjectId;
  quantity: number;
  finalPrice: number;
}

@Schema({ timestamps: true, versionKey: false })
export class Cart {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, required: true, ref: Product.name },
        quantity: { type: Number, default: 1 },
        finalPrice: { type: Number, required: true },
      },
    ],
  })
  products: ICartProduct[];

  @Prop({
    type: Number,
  })
  totalPrice: number;
}

export const cartSchema = SchemaFactory.createForClass(Cart);

cartSchema.pre('save', function (next) {
  this.totalPrice = this.products.reduce(
    (total, product) => total + product.finalPrice * product.quantity,
    0,
  );
  return next();
});

export type TCart = HydratedDocument<Cart> & Document;
