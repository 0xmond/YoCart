import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from 'src/db/models/user/user.repo';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepo,
  ) {}

  async verify(authorization: string) {
    const payload = this.jwtService.verify(authorization, {
      secret: process.env.JWT_SECRET,
    });

    const user = await this.userRepo.findByEmail(payload.email, {
      password: 0,
    });

    if (!user) throw new BadRequestException('Invalid token');

    return user;
  }
}
