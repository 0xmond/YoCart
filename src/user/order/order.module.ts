import { Module } from '@nestjs/common';
import { CartModel } from 'src/db/models/cart/cart.model';
import { OrderModel } from 'src/db/models/order/order.model';
import { OrderRepo } from 'src/db/models/order/order.repo';
import { CartModule } from '../cart/cart.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { StripeService } from 'src/common/services/payment/stripe.service';
import { ProductRepo } from 'src/db/models/product/product.repo';

@Module({
  imports: [OrderModel, CartModel, CartModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepo, StripeService, ProductRepo],
})
export class OrderModule {}
