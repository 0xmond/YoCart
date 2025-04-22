import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import {
  AddToCartDto,
  RemoveFromCartDto,
  UpdateProductQuantityDto,
} from './dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserRolesEnum } from 'src/common/enums';
import { Request } from 'express';
import { TUser } from 'src/db/models/user/user.schema';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('user/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-to-cart')
  @Auth(UserRolesEnum.user)
  async addToCart(@Body() addToCartDto: AddToCartDto, @Req() request: Request) {
    const authUser: TUser = request['user'];
    const cart = await this.cartService.addToCart(addToCartDto, authUser);

    return { success: true, data: cart };
  }

  @Delete('remove-from-cart')
  @Auth(UserRolesEnum.user)
  async removeFromCart(
    @Body() removeFromCart: RemoveFromCartDto,
    @Req() request: Request,
  ) {
    const authUser: TUser = request['user'];
    const cart = await this.cartService.removeFromCart(
      removeFromCart,
      authUser,
    );

    return { success: true, data: cart };
  }

  @Put('update-quantity')
  @Auth(UserRolesEnum.user)
  async updateProductQuantity(
    @Body() updateProductQuantityDto: UpdateProductQuantityDto,
    @Req() request: Request,
  ) {
    const authUser: TUser = request['user'];
    const cart = await this.cartService.updateProductQuantity(
      updateProductQuantityDto,
      authUser,
    );

    return { success: true, data: cart };
  }

  @Get()
  @Public()
  @Auth(UserRolesEnum.user)
  async getCart(@Req() request: Request) {
    const authUser: TUser = request['user'];
    const cart = await this.cartService.getCart(authUser);

    return { success: true, data: cart };
  }

  @Delete()
  @Auth(UserRolesEnum.user)
  async removeAllProducts(@Req() request: Request) {
    const authUser: TUser = request['user'];
    const cart = await this.cartService.removeAllProducts(authUser._id);

    return { success: true, data: cart };
  }
}
