import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Types } from 'mongoose';
import { messages } from 'src/common/enums';
import { CategoryRepo } from 'src/db/models/category/category.repo';
import { ProductRepo } from 'src/db/models/product/product.repo';
import { UpdateProductDto } from './dto';

@Injectable()
export class ProductService {
  @Inject(CACHE_MANAGER) private cacheManager: Cache;

  constructor(
    private readonly productRepo: ProductRepo,
    private readonly categoryRepo: CategoryRepo,
  ) {}

  async findAll(request: Request) {
    let { limit, sort, page, ...filter } = request['parsedQuery'];

    filter = JSON.parse(
      JSON.stringify(filter).replace(/gte|lte/g, (match) => `$${match}`),
    );

    const skip = (page - 1) * limit;

    const cacheKey = `products:list:${JSON.stringify({ filter, limit, sort, skip })}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached;
    }

    const products = await this.productRepo.find({
      filter,
      limit,
      sort,
      skip,
      populate: [{ path: 'createdBy', select: 'name' }],
    });

    await this.cacheManager.set(cacheKey, products);

    return products;
  }

  async findOne(id: Types.ObjectId) {
    const cacheKey = `products:findOne:${JSON.stringify({ id })}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached;
    }

    const product = await this.productRepo.findOne({
      filter: { _id: id },
      populate: [{ path: 'createdBy', select: 'name' }],
    });

    await this.cacheManager.set(cacheKey, product);

    return product;
  }

  async update(id: Types.ObjectId, updateProductDto: UpdateProductDto) {
    const product = await this.productRepo.findOne({ filter: { _id: id } });

    if (!product) throw new NotFoundException(messages.product.notFound);

    const category = this.categoryRepo.findOne({
      filter: { _id: updateProductDto.category },
    });

    if (!category) throw new NotFoundException(messages.category.notFound);

    return await product.updateOne(updateProductDto, { new: true });
  }

  async delete(id: Types.ObjectId) {
    const product = await this.productRepo.findOne({
      filter: { _id: id },
    });

    if (!product) throw new NotFoundException(messages.product.notFound);

    await this.productRepo.deleteOne({ _id: id });
    return;
  }
}
