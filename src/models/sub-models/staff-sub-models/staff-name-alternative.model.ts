import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { StaffName } from './staff-name.model';
import { BaseEntity } from '~/models/base-models';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'staffAlternative' })
@ObjectType()
export class StaffAlternative extends BaseEntity {
  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @AutoMap(() => StaffName)
  @Field((type) => StaffName, { nullable: true })
  @ManyToOne(() => StaffName, (staffName) => staffName.alternative)
  staffName?: StaffName;
}
