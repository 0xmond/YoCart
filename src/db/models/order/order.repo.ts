import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/db/base.repo';
import { Order, TOrder } from './order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrderRepo extends BaseRepo<TOrder> {
  constructor(@InjectModel(Order.name) orderModel: Model<TOrder>) {
    super(orderModel);
  }
}
