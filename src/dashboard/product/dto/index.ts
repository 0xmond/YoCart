import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title?: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  price?: number;

  @Type(() => Number)
  @IsNumber()
  discount?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  stock?: number;

  @Type(() => Types.ObjectId)
  @IsMongoId()
  category?: Types.ObjectId;
}

export class FindOneDto {
  @Type(() => Types.ObjectId)
  @IsMongoId()
  id: Types.ObjectId;
}
