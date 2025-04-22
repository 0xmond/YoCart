import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  messages,
  UpdateProductStockEnum as UpdateProductQuantity,
} from 'src/common/enums';
import { CartRepo } from 'src/db/models/cart/cart.repo';
import { TCart } from 'src/db/models/cart/cart.schema';
import { ProductRepo } from 'src/db/models/product/product.repo';
import { TUser } from 'src/db/models/user/user.schema';
import {
  AddToCartDto,
  RemoveFromCartDto,
  UpdateProductQuantityDto,
} from './dto';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepo,
    private readonly productRepo: ProductRepo,
  ) {}

  async addToCart(addToCartDto: AddToCartDto, authUser: TUser) {
    const product = await this.productRepo.findOne({
      filter: { _id: addToCartDto._id },
    });

    if (!product) throw new NotFoundException(messages.product.notFound);
    if (!product.stock)
      throw new NotFoundException(messages.product.notAvailable);

    const newQuantity = Math.min(addToCartDto.quantity, product.stock);

    const cart = await this.cartRepo.findOne({
      filter: { user: authUser._id },
    });

    if (!cart) {
      const preparedCart: Partial<TCart> = {
        products: [
          {
            product: product._id,
            quantity: newQuantity,
            finalPrice: product.finalPrice,
          },
        ],
        user: authUser._id,
      };

      return await this.cartRepo.create(preparedCart);
    }

    const productExists = cart.products.find((value) =>
      value.product.equals(product._id),
    );

    if (productExists)
      throw new BadRequestException(messages.product.isAddedToCart);

    cart.products.push({
      product: product._id,
      quantity: newQuantity,
      finalPrice: product.finalPrice,
    });

    return await cart.save();
  }

  async removeFromCart(removeFromCartDto: RemoveFromCartDto, authUser: TUser) {
    const cart = await this.cartRepo.findOne({
      filter: { user: authUser._id },
    });

    if (!cart || !cart.products.length)
      throw new NotFoundException(messages.cart.notFound);

    if (
      !cart.products.some((prod) => prod.product.equals(removeFromCartDto._id))
    )
      throw new NotFoundException(messages.product.notFound);

    const product = await this.productRepo.findOne({
      filter: { _id: removeFromCartDto._id },
    });

    if (!product) throw new NotFoundException(messages.product.notFound);

    const productIndex = cart.products.findIndex((value) =>
      value.product.equals(product._id),
    );

    cart.products.splice(productIndex, 1);

    return await cart.save();
  }

  async updateProductQuantity(
    updateProductQuantityDto: UpdateProductQuantityDto,
    authUser: TUser,
  ) {
    const cart = await this.cartRepo.findOne({
      filter: { user: authUser._id },
    });

    if (!cart || !cart.products.length)
      throw new NotFoundException(messages.cart.notFound);

    const product = await this.productRepo.findOne({
      filter: {
        _id: updateProductQuantityDto._id,
      },
    });

    if (!product) throw new NotFoundException(messages.product.notFound);

    const productExists = cart.products.find((value) =>
      value.product.equals(product._id),
    );

    if (!productExists) throw new NotFoundException(messages.product.notFound);

    if (productExists.quantity == updateProductQuantityDto.quantity)
      return cart;

    const newQuantity = Math.min(
      updateProductQuantityDto.quantity,
      product.stock,
    );

    productExists.quantity = newQuantity;

    return await cart.save();
  }

  async getCart(authUser: TUser) {
    const cart = await this.cartRepo
      .findOne({
        filter: { user: authUser._id },
        populate: [
          {
            path: 'products.product',
            select: '-description -category -updatedBy -folderId',
            populate: { path: 'createdBy', select: 'name -_id' },
          },
        ],
      })
      .lean();

    if (!cart) throw new NotFoundException(messages.cart.isEmpty);

    return cart;
  }

  async removeAllProducts(authUserId: Types.ObjectId) {
    const cart = await this.cartRepo.updateOne({
      filter: { user: authUserId },
      update: { products: [], totalPrice: 0 },
    });

    if (!cart) throw new NotFoundException(messages.cart.isEmpty);

    return cart;
  }
}
