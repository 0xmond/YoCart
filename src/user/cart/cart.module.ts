import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepo } from 'src/db/models/cart/cart.repo';
import { CartModel } from 'src/db/models/cart/cart.model';
import { ProductRepo } from 'src/db/models/product/product.repo';
import { ProductModel } from 'src/db/models/product/product.model';

@Module({
  imports: [CartModel, ProductModel],
  controllers: [CartController],
  providers: [CartService, CartRepo, ProductRepo],
  exports: [CartModel, ProductModel, CartService, CartRepo, ProductRepo],
})
export class CartModule {}
