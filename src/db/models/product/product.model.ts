import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from './product.schema';

export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: productSchema },
]);
