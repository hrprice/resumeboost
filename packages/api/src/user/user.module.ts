import { Module } from '@nestjs/common';
import { UserSchema, User } from './user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
