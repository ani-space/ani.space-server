import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'fuzzyDates' })
@ObjectType()
export class FuzzyDateInt extends BaseEntity {
  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  year?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  month?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  day?: number;
}
