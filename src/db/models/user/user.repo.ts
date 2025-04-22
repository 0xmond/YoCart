import { BaseRepo } from 'src/db/base.repo';
import { TUser, User } from './user.schema';
import { Model, ProjectionType, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepo extends BaseRepo<TUser> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<TUser>,
  ) {
    super(userModel);
  }

  findByEmail(
    email: string,
    projection?: ProjectionType<TUser>,
    options?: QueryOptions,
  ) {
    return this.findOne({ filter: { email }, projection, options });
  }
}
