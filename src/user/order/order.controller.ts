import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserRolesEnum } from 'src/common/enums';
import { Request } from 'express';
import { CreateOrderDto, PayWithStripeDto, RefundWithStripeDto } from './dto';

@Controller('user/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Auth(UserRolesEnum.user)
  async create(
    @Req() request: Request,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const authUser = request['user'];
    const data = await this.orderService.create(createOrderDto, authUser);

    return { success: true, data };
  }

  @Post('refund')
  @Auth(UserRolesEnum.user)
  async refundWithStripeDto(
    @Req() request: Request,
    @Body() refundWithStripeDto: RefundWithStripeDto,
  ) {
    const authUser = request['user'];
    const data = await this.orderService.refundWithStripe(
      authUser,
      refundWithStripeDto.orderId,
    );

    return { success: true, data };
  }

  @Post('webhook')
  async webhook(@Body() payment: any) {
    return await this.orderService.webhook(payment);
  }
}
