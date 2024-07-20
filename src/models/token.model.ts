import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { User } from './user.model';
import { BaseEntity } from './base-models';

@Entity({ name: 'tokens' })
export class Token extends BaseEntity {
  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;

  @Index({ unique: true })
  @Column()
  token: string;
}
