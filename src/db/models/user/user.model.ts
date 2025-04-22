import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './user.schema';

// model
export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);
