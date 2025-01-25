import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OnboardingStep, User } from './user.model';
import { Context } from 'src/context/context.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly context: Context, private readonly userService: UserService) {}

  @Query(() => User)
  async getUser(): Promise<User> {
    const user = this.context.get('user');
    return user;
  }

  @Mutation(() => User)
  async updateOnboardingStep(
    @Args('onboardingStep', { type: () => OnboardingStep }) onboardingStep: OnboardingStep
  ): Promise<User> {
    const { _id } = this.context.get('user');
    const updated = await this.userService.updateUser({ _id, onboardingStep });
    if (!updated) throw new NotFoundException();
    return updated;
  }
}
