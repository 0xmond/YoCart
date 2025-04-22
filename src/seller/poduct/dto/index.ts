import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { IImage } from 'src/db/models/category/category.schema';

export interface IImages {
  data: IImage[];
  folderId: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsNumber()
  discount: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  stock?: number;

  @Type(() => Types.ObjectId)
  @IsMongoId()
  category: Types.ObjectId;

  @IsObject()
  images: IImages;
}
