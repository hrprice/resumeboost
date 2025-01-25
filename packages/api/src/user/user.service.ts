import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserInput, User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId);
  }

  async updateUser(user: UpdateUserInput): Promise<User | null> {
    const { _id, ...rest } = user;
    return this.userModel.findByIdAndUpdate(_id, { $set: rest }, { new: true });
  }
}
