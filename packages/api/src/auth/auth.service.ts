import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';

@Injectable()
export class AuthService {
  constructor(@InjectFirebaseAdmin() private firebaseAdmin: FirebaseAdmin) {}

  async verifyToken(token: string): Promise<boolean> {
    try {
      await this.firebaseAdmin.auth.verifyIdToken(token);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
