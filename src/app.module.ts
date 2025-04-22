import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SellerModule } from './seller/seller.module';
import { GlobalModule } from './global.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL as string),
    AuthModule,
    UserModule,
    DashboardModule,
    SellerModule,
    GlobalModule,
  ],
})
export class AppModule {}
