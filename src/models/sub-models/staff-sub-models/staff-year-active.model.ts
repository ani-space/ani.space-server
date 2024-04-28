import { Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '~/models/base-models';

@Entity({ name: 'staffYearActives' })
@ObjectType()
export class StaffYearActive extends BaseEntity {
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  startYear?: number;

  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  endYear?: number;
}
