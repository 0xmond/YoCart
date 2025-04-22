import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import {
  messages,
  OrderStatusEnum,
  UpdateProductStockEnum,
} from 'src/common/enums';
import { OrderRepo } from 'src/db/models/order/order.repo';
import { ProductRepo } from 'src/db/models/product/product.repo';
import { TUser } from 'src/db/models/user/user.schema';
import { CartService } from 'src/user/cart/cart.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(
    private readonly cartService: CartService,
    private readonly orderRepo: OrderRepo,
    private readonly productRepo: ProductRepo,
  ) {}

  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  async createCheckoutSession({
    customer_email,
    metadata,
    line_items,
    discounts = [],
  }: Stripe.Checkout.SessionCreateParams) {
    return await this.stripe.checkout.sessions.create({
      customer_email,
      metadata,
      currency: 'egp',
      line_items,
      success_url: 'https://google.com',
      cancel_url: 'https://fb.com',
      discounts,
      mode: 'payment',
    });
  }

  async refund(authUser: TUser, orderId: Types.ObjectId) {
    const order = await this.orderRepo.findOne({
      filter: {
        _id: orderId,
        user: authUser._id,
        orderStatus: {
          $in: [
            OrderStatusEnum.PAID,
            OrderStatusEnum.PLACED,
            OrderStatusEnum.PENDING,
          ],
        },
      },
    });

    if (!order) throw new NotFoundException(messages.order.notFound);

    const timeDiff = new Date().getTime() - order['createdAt'].getTime();
    const timeDiffInDays = timeDiff / (1000 * 60 * 60 * 24);

    if (timeDiffInDays > 2)
      throw new BadRequestException(messages.order.cannotBeCanceled);

    await this.stripe.refunds.create({
      payment_intent: order.payment_intent,
      metadata: { _id: order.id },
      reason: 'requested_by_customer',
    });
  }
}
