import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CategoryRepo } from 'src/db/models/category/category.repo';
import { messages } from 'src/common/enums';
import { Types } from 'mongoose';
import { CloudService } from 'src/common/services/cloud/cloud.service';
import slugify from 'slugify';
import { ProductRepo } from 'src/db/models/product/product.repo';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepo,
    private readonly cloudService: CloudService,
    private readonly productRepo: ProductRepo,
  ) {}

  // create category >> used interceptor
  async create(createCategoryDto: CreateCategoryDto, userId: Types.ObjectId) {
    const category = await this.categoryRepo.findOne({
      filter: { name: createCategoryDto.name },
    });

    if (category) throw new ConflictException(messages.category.alreadyExist);

    /**
     ******* Use this if you used upload service not interceptor *******
     * 
      const categoryId = Math.ceil(Math.random() * 999999 + 100000).toString();
      const { public_id, secure_url } = await this.cloudService.uploadFile({
      path: file.path,
      folder: `admin/category/${categoryId}/image`,
    });
     */

    const createdCategory = await this.categoryRepo.create({
      name: createCategoryDto.name,
      createdBy: userId,
      image: {
        secure_url: createCategoryDto.image.secure_url,
        public_id: createCategoryDto.image.public_id,
      },
      folderId: createCategoryDto.image.folderId,
    });

    return createdCategory;
  }

  // update category
  async update(
    updateCategoryDto: UpdateCategoryDto,
    id: Types.ObjectId,
    file: Express.Multer.File,
  ) {
    const category = await this.categoryRepo.findOne({ filter: { _id: id } });
    if (!category) throw new NotFoundException(messages.category.notFound);
    if (file) {
      const { secure_url } = await this.cloudService.uploadFile({
        path: file.path,
        public_id: category.image.public_id,
      });
      category.image.secure_url = secure_url;
    }

    if (updateCategoryDto.name) {
      category.name = updateCategoryDto.name;
      category.slug = slugify(updateCategoryDto.name);
    }

    return await category.save();
  }

  // get all categories
  async getAll() {
    const categories = await this.categoryRepo.find();

    if (!categories.length)
      throw new NotFoundException(messages.category.notFound);

    return categories;
  }

  // get category
  async getOne(id: Types.ObjectId) {
    const category = await this.categoryRepo.findOne({ filter: { _id: id } });

    if (!category) throw new NotFoundException(messages.category.notFound);

    return category;
  }

  // delete category
  async deleteOne(id: Types.ObjectId) {
    const category = await this.categoryRepo.findOne({ filter: { _id: id } });

    if (!category) throw new NotFoundException(messages.category.notFound);

    const products = await this.productRepo.delete({ category: id });

    await this.categoryRepo.deleteOne({ _id: id });
    return;
  }
}
