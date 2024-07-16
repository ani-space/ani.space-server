import { registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.model';
import { BaseEntity } from './base-models';

export enum SocialProviderTypes {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

registerEnumType(SocialProviderTypes, {
  name: 'SocialAuthProviders',
});

@Entity({ name: 'socialProvider' })
export class SocialProvider extends BaseEntity {
  @Column({ enum: SocialProviderTypes })
  provider: SocialProviderTypes;

  @Column({ unique: true })
  socialId: string;

  @ManyToOne((_type) => User, (user) => user.socialProviders)
  user: User;
}
