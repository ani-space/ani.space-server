import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { Field, ObjectType } from '@nestjs/graphql';
import { StaffAlternative } from './staff-name-alternative.model';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'staffNames' })
@ObjectType()
export class StaffName extends BaseEntity {
  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  first?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  middle?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  last?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  full?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  native?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  userPreferred?: string;

  @AutoMap(() => [StaffAlternative])
  @OneToMany(() => StaffAlternative, (alternative) => alternative.staffName)
  alternative?: StaffAlternative[];
}
