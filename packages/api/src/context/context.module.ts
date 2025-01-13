import { Module, Global } from '@nestjs/common';
import { Context } from './context.service';
import { UserModule } from 'src/user/user.module';

@Global()
@Module({
  imports: [UserModule],
  providers: [Context],
  exports: [Context]
})
export class ContextModule {}
