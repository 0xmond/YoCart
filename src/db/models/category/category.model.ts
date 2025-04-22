import { MongooseModule } from '@nestjs/mongoose';
import { categorySchema } from './category.schema';

export const CategoryModel = MongooseModule.forFeature([
  { name: 'Category', schema: categorySchema },
]);
