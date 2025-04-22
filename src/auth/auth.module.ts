import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepo } from 'src/db/models/user/user.repo';
import { UserModel } from 'src/db/models/user/user.model';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [UserModel],
  controllers: [AuthController],
  providers: [AuthService, UserRepo, JwtService],
  exports: [UserModel, JwtService, UserRepo],
})
export class AuthModule {}
