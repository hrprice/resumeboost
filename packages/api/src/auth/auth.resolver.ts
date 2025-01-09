import { RegistrationInput } from './auth.dto';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.model';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async registerWithEmailAndPassword(
    @Args('registrationInput', { type: () => RegistrationInput }) registrationInput: RegistrationInput
  ): Promise<User> {
    return this.authService.registerWithEmailAndPassword(registrationInput);
  }
}
