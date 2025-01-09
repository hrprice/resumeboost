import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { RegistrationInput } from './auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.model';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Injectable()
export class AuthService {
  constructor(
    @InjectFirebaseAdmin() private firebaseAdmin: FirebaseAdmin,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async verifyToken(token: string): Promise<DecodedIdToken | null> {
    const decodedToken = await this.firebaseAdmin.auth.verifyIdToken(token).catch((error) => {
      console.error(error);
    });
    return decodedToken ?? null;
  }

  async registerWithEmailAndPassword({ email, password, firstName, lastName }: RegistrationInput): Promise<User> {
    return this.userModel.create({ email, password, firstName, lastName, emailVerified: false }).then(async (res) => {
      await this.firebaseAdmin.auth.createUser({
        uid: res._id.toString(),
        email,
        password,
        displayName: `${firstName.toLowerCase()} ${lastName.toLowerCase()}`
      });
      return res;
    });
  }
}
