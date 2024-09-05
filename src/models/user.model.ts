import { AutoMap } from '@automapper/classes';
import { IsEmail, MinLength } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base-models';
import { Token } from './token.model';
import { SocialProvider } from './social-provider.model';
import { decodePassword, encodePassword } from '~/utils/security/bcrypt';
import { UserRole } from './sub-models/user-sub-models/role.enum';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @AutoMap()
  @Index({ unique: true })
  @Column({ nullable: true })
  userName?: string;

  @AutoMap()
  @IsEmail()
  @Index({ unique: true })
  @Column()
  email: string;

  @Column({ nullable: true })
  @MinLength(6)
  password?: string;

  @AutoMap()
  @Column({ nullable: true })
  displayName?: string;

  @AutoMap(() => [Token])
  @OneToMany(() => Token, (token) => token.user)
  @JoinColumn()
  refreshTokens: Token[];

  @OneToMany((_type) => SocialProvider, (socialProvider) => socialProvider.user)
  socialProviders: SocialProvider;

  @AutoMap(() => [String])
  @Column('text', { array: true, default: [UserRole.USER.toString()] })
  roles: string[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;

    this.password = await encodePassword(this.password);
  }

  async comparePassword(password: string) {
    if (!this.password) return false;

    return decodePassword({
      currentPassword: this.password,
      reqPassword: password,
    });
  }
}
