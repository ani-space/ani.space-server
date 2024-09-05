import { Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '~/models/base-models';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'staffYearActives' })
@ObjectType()
export class StaffYearActive extends BaseEntity {
  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  startYear?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  endYear?: number;
}
