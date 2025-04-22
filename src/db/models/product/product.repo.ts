import { InjectModel } from '@nestjs/mongoose';
import { Product, TProduct } from './product.schema';
import mongoose, {
  Model,
  MongooseQueryOptions,
  MongooseUpdateQueryOptions,
  UpdateQuery,
} from 'mongoose';
import { BaseRepo } from 'src/db/base.repo';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ICartProduct } from '../cart/cart.schema';
import { RealTimeGateway } from 'src/common/gateways/websocket.gateway';
import { messages, UpdateProductStockEnum } from 'src/common/enums';
import { UpdateOptions } from 'mongodb';

interface IUpdateProductStock {
  product: ICartProduct;
  action: UpdateProductStockEnum;
  quantity: number;
  session?: mongoose.mongo.ClientSession;
}

@Injectable()
export class ProductRepo extends BaseRepo<TProduct> {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<TProduct>,
    private readonly realTimeGateway: RealTimeGateway,
  ) {
    super(productModel);
  }

  async updateProductStock({
    product,
    action,
    quantity,
    session,
  }: IUpdateProductStock) {
    const isUpdatedProduct = await this.updateOne({
      filter: { _id: product.product._id },
      update: {
        $inc: { stock: action ? quantity : -quantity },
      },
      options: { session },
    });

    if (!isUpdatedProduct)
      throw new NotFoundException(messages.product.notFound);
    this.realTimeGateway.emitProductStockUpdate(
      product.product,
      isUpdatedProduct.stock,
    );
  }
}
