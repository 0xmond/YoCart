import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { UpdateProductStockEnum } from 'src/common/enums';

export class AddToCartDto {
  @Type(() => Types.ObjectId)
  @IsMongoId()
  _id: Types.ObjectId;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity: number = 1;
}

export class RemoveFromCartDto {
  @Type(() => Types.ObjectId)
  @IsMongoId()
  _id: Types.ObjectId;
}

export class UpdateProductQuantityDto {
  @Type(() => Types.ObjectId)
  @IsMongoId()
  _id: Types.ObjectId;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity: number = 1;
}
