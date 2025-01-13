import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Context } from './context.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { GqlContextType } from '@nestjs/graphql';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(
    private context: Context,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const graphqlCtx = ctx.getType<GqlContextType>() === 'graphql';
    const request = graphqlCtx ? ctx.getArgByIndex(2).req : ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1];

    return new Observable((observer) => {
      this.context.run(async () => {
        if (token) {
          try {
            const decodedToken = await this.authService.verifyToken(token);
            if (decodedToken) {
              const user = await this.userService.getUserById(decodedToken.uid);
              this.context.set('user', user);
            } else {
              this.context.set('user', null);
            }
          } catch (err) {
            console.error('Invalid token:', err.message);
          }
        }

        next.handle().subscribe({
          next: (value) => observer.next(value),
          error: (err) => observer.error(err),
          complete: () => observer.complete()
        });
      });
    });
  }
}
