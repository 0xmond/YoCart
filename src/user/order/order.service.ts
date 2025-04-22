import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import mongoose, { Types } from 'mongoose';
import {
  messages,
  OrderStatusEnum,
  PaymentMethodsEnum,
  UpdateProductStockEnum,
} from 'src/common/enums';
import { StripeService } from 'src/common/services/payment/stripe.service';
import { OrderRepo } from 'src/db/models/order/order.repo';
import { TUser } from 'src/db/models/user/user.schema';
import Stripe from 'stripe';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto';
import { TOrder } from 'src/db/models/order/order.schema';
import { ProductRepo } from 'src/db/models/product/product.repo';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly cartService: CartService,
    private readonly stripeService: StripeService,
    private readonly productRepo: ProductRepo,
  ) {}

  async create(createOrderDto: CreateOrderDto, authUser: TUser) {
    const cart = await this.cartService.getCart(authUser);

    if (!cart || !cart.products.length)
      throw new NotFoundException(messages.cart.isEmpty);

    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const order = await this.orderRepo.createWithOptions(
        {
          user: authUser._id,
          cart: cart,
          address: createOrderDto.address,
          paymentMethod: createOrderDto.paymentMethod,
        },
        { session },
      );

      const returnData = { order: order };
      if (order.paymentMethod == PaymentMethodsEnum.CREDIT_CARD) {
        const url = await this.payWithStripe(authUser, order);
        returnData['payment_url'] = url;
      }

      await this.markOrderAsDone(undefined, order, session); // undefined because there is no payment details yet

      return returnData;
    } catch (error) {
      await session.abortTransaction();
      throw new InternalServerErrorException('Something happened wrong');
    } finally {
      session.endSession();
    }
  }

  async payWithStripe(authUser: TUser, order: TOrder) {
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      order.cart.products.map((prod) => ({
        price_data: {
          product_data: {
            name: prod.product['title'],
            images: prod.product['images'].map((img) => img.secure_url),
          },
          currency: 'EGP',
          unit_amount: prod.product['finalPrice'] * 100,
        },
        quantity: prod.quantity,
      }));

    const { url } = await this.stripeService.createCheckoutSession({
      customer_email: authUser.email,
      metadata: { _id: order._id.toString() },
      line_items,
    });

    return url;
  }

  async refundWithStripe(authUser: TUser, orderId: Types.ObjectId) {
    return await this.stripeService.refund(authUser, orderId);
  }

  async markOrderAsDone(
    payment: any,
    order: TOrder,
    session?: mongoose.mongo.ClientSession,
  ) {
    if (payment.data.object.payment_status != 'paid')
      throw new BadRequestException('Something went wrong');

    if (payment && order.paymentMethod == PaymentMethodsEnum.CREDIT_CARD)
      await order.updateOne(
        {
          orderStatus: OrderStatusEnum.PAID,
          orderChanges: { paidAt: Date.now() },
          payment_intent: payment.data.object.payment_intent,
        },
        { session },
      );

    for (const prod of order.cart.products) {
      await this.productRepo.updateProductStock({
        product: prod,
        action: UpdateProductStockEnum.DECREASE,
        quantity: prod.quantity,
        session,
      });
    }
    await this.cartService.removeAllProducts(order.user);
  }

  async markOrderAsCancelled(payment: any, order: TOrder) {
    if (payment.data.object.status != 'succeeded')
      throw new BadRequestException('Something went wrong');

    for (const prod of order.cart.products) {
      await this.productRepo.updateProductStock({
        product: prod,
        action: UpdateProductStockEnum.INCREASE,
        quantity: prod.quantity,
      });
    }

    order.orderChanges['canceledAt'] = new Date();
    order.orderChanges['canceledBy'] = order.user;
    order.orderStatus = OrderStatusEnum.CANCELLED;

    await order.save();
  }

  async webhook(payment: any) {
    const order = await this.orderRepo.findOne({
      filter: { _id: payment.data.object.metadata._id },
    });
    if (!order) throw new NotFoundException(messages.order.notFound);

    const paymentEvent = payment.data.object.object;
    const session = await mongoose.startSession();
    try {
      switch (paymentEvent) {
        case 'checkout.session':
          await this.markOrderAsDone(payment, order);
          break;

        case 'refund':
          await this.markOrderAsCancelled(payment, order);
          break;
        default:
          break;
      }
    } catch (error) {
      await session.abortTransaction();
      throw new InternalServerErrorException('Something happened wrong');
    } finally {
      session.endSession();
    }

    return true;
  }
}
