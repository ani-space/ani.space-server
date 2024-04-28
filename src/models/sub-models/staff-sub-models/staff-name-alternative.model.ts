import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { StaffName } from './staff-name.model';
import { BaseEntity } from '~/models/base-models';

@Entity({ name: 'staffAlternative' })
@ObjectType()
export class StaffAlternative extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field((type) => StaffName, { nullable: true })
  @ManyToOne(() => StaffName, (staffName) => staffName.alternative)
  staffName?: StaffName;
}
