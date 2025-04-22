export enum UserRolesEnum {
  admin = 'Admin',
  user = 'User',
  seller = 'Seller',
}

const getMessages = (entity: string) => {
  return {
    notFound: `${entity} is not found`,
    alreadyExist: `${entity} is already exist`,
    updatedSuccessfully: `${entity} is updated successfully`,
    archivedSuccessfully: `${entity} is archived successfully`,
    deletedSuccessfully: `${entity} is deleted successfully`,
    removedSuccessfully: `${entity} is removed successfully`,
    createdSuccessfully: `${entity} is created successfully`,
    isEmpty: `${entity} is empty`,
  };
};

export const messages = {
  user: {
    ...getMessages('User'),
    emailConfirmed: 'Email confirmed successfully',
  },
  category: getMessages('Category'),
  order: {
    ...getMessages('Order'),
    cannotBeCanceled: 'Order cannot be canceled',
  },
  product: {
    ...getMessages('Product'),
    isAddedToCart: 'Product is already added to cart',
    notAvailable: 'Product is not available for now',
  },
  cart: { ...getMessages('Cart'), isEmpty: `Cart is empty` },
  email: { isSent: 'Email is sent successfully. Please check your inbox' },
  otp: { isInvalid: 'Invalid OTP' },
};

export enum UpdateProductStockEnum {
  DECREASE,
  INCREASE,
}

export enum OrderStatusEnum {
  PENDING = 'pending',
  PLACED = 'placed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  REFUNDED = 'refunded',
  ON_WAY = 'on_way',
  PAID = 'paid',
}

export enum PaymentMethodsEnum {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
}

export enum OTP_TYPE {
  SEND_EMAIL = 'Send-email',
  FORGET_PASSWORD = 'Forget-password',
}

export enum EMAIL_SUBJECTS {
  EMAIL_CONFIRMATION = 'Email Confirmation',
  RESET_PASSWORD = 'Reset Password',
}
