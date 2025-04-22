import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Product } from '../product/product.schema';
import { User } from '../user/user.schema';
import { Cart, cartSchema, ICartProduct, TCart } from '../cart/cart.schema';
import { OrderStatusEnum, PaymentMethodsEnum } from 'src/common/enums';

interface IOrderChanges {
  paidAt: Date;
  deliveredAt: Date;
  deliveredBy: Types.ObjectId;
  refundedAt: Date;
  refundedBy: Types.ObjectId;
  canceledAt: Date;
  canceledBy: Types.ObjectId;
}

interface IOrderCart {
  products: ICartProduct[];
  totalPrice: number;
}

@Schema({ timestamps: true, versionKey: false })
export class Order {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({
    type: {
      products: [
        {
          product: {
            type: {
              title: String,
              finalPrice: Number,
              images: [{ secure_url: String, public_id: String }],
            },
          },
          quantity: Number,
          finalPrice: Number,
        },
      ],
      totalPrice: Number,
    },
    required: true,
  })
  cart: IOrderCart;

  @Prop({
    type: Number,
    default: function () {
      return this.cart.totalPrice;
    },
  })
  totalPrice: number;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, enum: PaymentMethodsEnum, required: true })
  paymentMethod: string;

  @Prop({
    type: String,
    enum: OrderStatusEnum,
    required: true,
    default: function () {
      if (this.paymentMethod == PaymentMethodsEnum.CASH)
        return OrderStatusEnum.PLACED;
      return OrderStatusEnum.PENDING;
    },
  })
  orderStatus: string;

  @Prop({ type: Date, default: Date.now() + 7 * 24 * 60 * 60 * 1000 })
  arrivesAt: Date;

  @Prop({
    type: {
      paidAt: Date,
      deliveredAt: Date,
      deliveredBy: { type: SchemaTypes.ObjectId, ref: User.name },
      refundedAt: Date,
      refundedBy: { type: SchemaTypes.ObjectId, ref: User.name },
      canceledAt: Date,
      canceledBy: { type: SchemaTypes.ObjectId, ref: User.name },
    },
  })
  orderChanges: Partial<IOrderChanges>;

  @Prop({ type: String })
  payment_intent: string;
}

export const orderSchema = SchemaFactory.createForClass(Order);

export type TOrder = HydratedDocument<Order> & Document;
