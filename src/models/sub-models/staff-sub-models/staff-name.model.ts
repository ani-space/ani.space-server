import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { Field, ObjectType } from '@nestjs/graphql';
import { StaffAlternative } from './staff-name-alternative.model';

@Entity({ name: 'staffNames' })
@ObjectType()
export class StaffName extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  first?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  middle?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  last?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  full?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  native?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  userPreferred?: string;

  @OneToMany(() => StaffAlternative, (alternative) => alternative.staffName)
  alternative?: StaffAlternative[];
}
