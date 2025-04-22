import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, TCart } from './cart.schema';
import { Model } from 'mongoose';
import { BaseRepo } from 'src/db/base.repo';

@Injectable()
export class CartRepo extends BaseRepo<TCart> {
  constructor(@InjectModel(Cart.name) cartModel: Model<TCart>) {
    super(cartModel);
  }
}
