import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Types } from 'mongoose';
import { Auth } from 'src/common/decorators/auth.decorator';
import { messages, UserRolesEnum } from 'src/common/enums';
import { UploadMultiFileInterceptor } from 'src/common/interceptors/upload.interceptor';
import { multerOptions } from 'src/common/utils/multer.utils';
import { CreateProductDto } from './dto';
import { ProductService } from './product.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('seller/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // create product
  @Post()
  @Auth(UserRolesEnum.seller)
  @UseInterceptors(
    FilesInterceptor('images', 5, multerOptions(['image/jpeg', 'image/png'])),
    UploadMultiFileInterceptor,
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() request: Request,
  ) {
    const authUser = request['user'];
    const product = await this.productService.create(
      authUser,
      createProductDto,
    );

    return {
      success: true,
      message: messages.product.createdSuccessfully,
      data: product,
    };
  }

  @Delete(':id')
  @Auth(UserRolesEnum.seller)
  async deleteOne(@Param('id') id: Types.ObjectId, @Req() request: Request) {
    const authUser = request['user'];
    await this.productService.deleteOne(authUser, id);
    return { success: true, message: messages.product.deletedSuccessfully };
  }

  @Get()
  @Public()
  async find(@Req() request: Request) {
    const products = await this.productService.find(request);
    return { success: true, data: products };
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: Types.ObjectId) {
    const products = await this.productService.findOne(id);

    return { success: true, data: products };
  }
}
