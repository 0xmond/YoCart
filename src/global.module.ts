import { Global, Module } from '@nestjs/common';
import { RealTimeGatewayModule } from './common/gateways/websocket.module';
import { UserModel } from './db/models/user/user.model';
import { UserRepo } from './db/models/user/user.repo';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './common/services/security/token.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisConfig } from './common/config/redis.config';

@Global()
@Module({
  imports: [
    UserModel,
    RealTimeGatewayModule,
    CacheModule.registerAsync({
      isGlobal: true,
      ...redisConfig,
    }),
  ],
  providers: [UserRepo, JwtService, TokenService],
  exports: [UserRepo, JwtService, TokenService, RealTimeGatewayModule],
})
export class GlobalModule {}
