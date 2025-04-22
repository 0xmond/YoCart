import { Module } from '@nestjs/common';
import { ProductModule } from './poduct/product.module';

@Module({
  imports: [ProductModule],
})
export class SellerModule {}
