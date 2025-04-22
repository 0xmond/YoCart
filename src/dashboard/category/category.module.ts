import { Module } from '@nestjs/common';
import { CategoryModel } from 'src/db/models/category/category.model';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepo } from 'src/db/models/category/category.repo';
import { CloudService } from 'src/common/services/cloud/cloud.service';
import { ProductRepo } from 'src/db/models/product/product.repo';
import { ProductModel } from 'src/db/models/product/product.model';

@Module({
  imports: [CategoryModel, ProductModel],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepo, CloudService, ProductRepo],
})
export class CategoryModule {}
