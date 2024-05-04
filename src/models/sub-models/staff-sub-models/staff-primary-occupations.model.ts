import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { Staff } from '~/models/staff.model';

@Entity({ name: 'staffPrimaryOccupations' })
@ObjectType()
export class StaffPrimaryOccupation extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  occupation?: string;

  @ManyToOne(() => Staff, (staff) => staff.primaryOccupations)
  staff: Staff;
}
