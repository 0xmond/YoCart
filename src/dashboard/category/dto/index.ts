import { IsObject, IsOptional, IsString } from 'class-validator';

interface IImage {
  public_id: string;
  secure_url: string;
  folderId: string;
}

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsObject()
  @IsOptional()
  image: IImage;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;
}
