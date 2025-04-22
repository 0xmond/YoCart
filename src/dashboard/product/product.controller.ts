import { Body, Controller, Delete, Get, Param, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { UpdateProductDto } from './dto';
import { ProductService } from './product.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserRolesEnum } from 'src/common/enums';

@Controller('dashboard/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Auth(UserRolesEnum.admin)
  async findAll(@Req() request: Request) {
    const products = await this.productService.findAll(request);
    return { success: true, data: products };
  }

  @Get(':id')
  @Auth(UserRolesEnum.admin)
  async findOne(@Param('id') id: Types.ObjectId) {
    const product = await this.productService.findOne(id);
    return { success: true, data: product };
  }

  @Put(':id')
  @Auth(UserRolesEnum.admin)
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Auth(UserRolesEnum.admin)
  delete(@Param('id') id: Types.ObjectId) {
    return this.productService.delete(id);
  }
}
