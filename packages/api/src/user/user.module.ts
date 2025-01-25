import { Module } from '@nestjs/common';
import { UserSchema, User } from './user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), AuthModule],
  providers: [UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {}
