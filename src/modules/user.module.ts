import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from '~/common/mapper-profiles/user-profile';
import { IUserRepository } from '~/contracts/repositories/user-repository.interface';
import { IUserService } from '~/contracts/services/user-service.interface';
import { UserResolver } from '~/graphql/resolvers/user.resolver';
import { SocialProvider } from '~/models/social-provider.model';
import { User } from '~/models/user.model';
import { UserRepository } from '~/repositories/user.repository';
import { UserService } from '~/services/user.service';

const userServiceProvider: Provider = {
  provide: IUserService,
  useClass: UserService,
};
const userRepositoryProvider: Provider = {
  provide: IUserRepository,
  useClass: UserRepository,
};
@Module({
  imports: [TypeOrmModule.forFeature([User, SocialProvider])],

  providers: [
    UserResolver,
    userServiceProvider,
    userRepositoryProvider,
    UserProfile,
  ],

  exports: [userServiceProvider, userRepositoryProvider],
})
export class UserModule {}
