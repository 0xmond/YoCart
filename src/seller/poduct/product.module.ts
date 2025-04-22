import { Module } from '@nestjs/common';
import { ProductRepo } from 'src/db/models/product/product.repo';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductModel } from 'src/db/models/product/product.model';
import { CategoryRepo } from 'src/db/models/category/category.repo';
import { CategoryModel } from 'src/db/models/category/category.model';
import { CloudService } from 'src/common/services/cloud/cloud.service';

@Module({
  imports: [ProductModel, CategoryModel],
  controllers: [ProductController],
  providers: [ProductService, ProductRepo, CategoryRepo, CloudService],
})
export class ProductModule {}
