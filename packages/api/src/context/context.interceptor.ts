import { CallHandler, ExecutionContext, NestInterceptor, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Context } from './context.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(
    private context: Context,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1];

    this.context.run(async () => {
      if (token) {
        try {
          const decodedToken = await this.authService.verifyToken(token);
          if (decodedToken) {
            const user = await this.userService.getUserById(decodedToken.uid);
            this.context.set('user', user);
          }
          this.context.set('user', null);
        } catch (err) {
          console.error('Invalid token:', err.message);
        }
      }
      return next.handle();
    });

    return next.handle();
  }
}
