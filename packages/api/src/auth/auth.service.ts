import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { RegistrationInput } from './auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OnboardingStep, User } from 'src/user/user.model';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectFirebaseAdmin() private firebaseAdmin: FirebaseAdmin,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService
  ) {}

  private readonly registrationSecret = this.configService.get('REGISTRATION_SECRET');

  async verifyToken(token: string): Promise<DecodedIdToken | null> {
    const decodedToken = await this.firebaseAdmin.auth.verifyIdToken(token).catch((error) => {
      console.error(error);
    });
    return decodedToken ?? null;
  }

  async registerWithEmailAndPassword({
    email,
    password,
    firstName,
    lastName,
    registrationSecret
  }: RegistrationInput): Promise<User> {
    if (registrationSecret !== this.registrationSecret) throw new UnauthorizedException('Invalid registration secret');
    return this.userModel
      .create({ email, password, firstName, lastName, emailVerified: false, onboardingStep: OnboardingStep.StartChat })
      .then(async (res) => {
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
