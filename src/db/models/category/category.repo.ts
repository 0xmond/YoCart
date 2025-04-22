import { BaseRepo } from 'src/db/base.repo';
import { Category, TCategory } from './category.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryRepo extends BaseRepo<TCategory> {
  constructor(@InjectModel(Category.name) categoryModel: Model<TCategory>) {
    super(categoryModel);
  }
}
