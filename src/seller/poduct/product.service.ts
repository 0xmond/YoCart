import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { messages } from 'src/common/enums';
import { CategoryRepo } from 'src/db/models/category/category.repo';
import { ProductRepo } from 'src/db/models/product/product.repo';
import { TProduct } from 'src/db/models/product/product.schema';
import { CreateProductDto } from './dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TUser } from 'src/db/models/user/user.schema';

@Injectable()
export class ProductService {
  @Inject(CACHE_MANAGER) private cacheManager: Cache;

  constructor(
    private readonly productRepo: ProductRepo,
    private readonly categoryRepo: CategoryRepo,
  ) {}

  async create(authUser: TUser, createProductDto: CreateProductDto) {
    const { title, description, price, discount, stock, category } =
      createProductDto;

    const categoryExists = await this.categoryRepo.findOne({
      filter: { _id: category },
    });

    if (!categoryExists)
      throw new NotFoundException(messages.category.notFound);

    const preparedProduct: Partial<TProduct> = {
      title,
      description,
      price,
      discount,
      stock,
      category,
      slug: slugify(title),
      createdBy: authUser._id,
      images: createProductDto.images.data,
      folderId: createProductDto.images.folderId,
    };
    const product = await this.productRepo.create(preparedProduct);

    return product;
  }

  async deleteOne(authUser: TUser, id: Types.ObjectId) {
    const product = await this.productRepo.findOne({
      filter: { _id: id, createdBy: authUser._id },
    });

    if (!product) throw new NotFoundException(messages.product.notFound);

    await this.productRepo.deleteOne({ _id: id });
    return;
  }

  async find(request: Request) {
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
    const product = await this.productRepo.findOne({ filter: { _id: id } });

    if (!product) throw new NotFoundException(messages.product.notFound);

    return product;
  }
}
