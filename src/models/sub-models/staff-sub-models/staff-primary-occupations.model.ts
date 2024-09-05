import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { Staff } from '~/models/staff.model';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'staffPrimaryOccupations' })
@ObjectType()
export class StaffPrimaryOccupation extends BaseEntity {
  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  occupation?: string;

  @ManyToOne(() => Staff, (staff) => staff.primaryOccupations)
  staff: Staff;
}
