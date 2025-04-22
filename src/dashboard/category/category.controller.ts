import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { Auth } from 'src/common/decorators/auth.decorator';
import { messages, UserRolesEnum } from 'src/common/enums';
import { UploadInterceptor } from 'src/common/interceptors/upload.interceptor';
import { multerOptions } from 'src/common/utils/multer.utils';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('/dashboard/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Auth(UserRolesEnum.admin)
  @UseInterceptors(
    FileInterceptor('image', multerOptions(['image/jpeg', 'image/png'])), // >> uploading to server not cloud
    UploadInterceptor, // >> we use this to upload the already uploaded file to cloud
  )
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request,
  ) {
    const category = await this.categoryService.create(
      createCategoryDto,
      req['user']._id,
    );

    return {
      success: true,
      message: messages.category.createdSuccessfully,
      data: category,
    };
  }

  @Put(':id')
  @Auth(UserRolesEnum.admin)
  @UseInterceptors(
    FileInterceptor('image', multerOptions(['image/jpeg', 'image/png'])),
  )
  async update(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('id') id: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const category = await this.categoryService.update(
      updateCategoryDto,
      id,
      file,
    );
    return {
      success: true,
      message: messages.category.updatedSuccessfully,
      data: category,
    };
  }

  @Public()
  @Get()
  async getAll() {
    const category = await this.categoryService.getAll();

    return { success: true, data: category };
  }

  @Public()
  @Get(':id')
  async getOne(@Param('id') id: Types.ObjectId) {
    const category = await this.categoryService.getOne(id);

    return { success: true, data: category };
  }

  @Auth(UserRolesEnum.admin)
  @Delete(':id')
  async deleteOne(@Param('id') id: Types.ObjectId) {
    await this.categoryService.deleteOne(id);
    return {
      success: true,
      message: messages.category.deletedSuccessfully,
    };
  }
}
