import { Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { PaymentMethodsEnum } from 'src/common/enums';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsEnum(PaymentMethodsEnum)
  paymentMethod: string;
}

export class PayWithStripeDto {
  @Type(() => Types.ObjectId)
  @IsMongoId()
  orderId: Types.ObjectId;
}

export class RefundWithStripeDto {
  @Type(() => Types.ObjectId)
  @IsMongoId()
  orderId: Types.ObjectId;
}
