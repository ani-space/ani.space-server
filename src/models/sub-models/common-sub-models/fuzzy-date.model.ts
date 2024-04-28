import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '~/models/base-models';

@Entity({ name: 'fuzzyDates' })
@ObjectType()
export class FuzzyDateInt extends BaseEntity {
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  year?: number;

  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  month?: number;

  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  day?: number;
}
