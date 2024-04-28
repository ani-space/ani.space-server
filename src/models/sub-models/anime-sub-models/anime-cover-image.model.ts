import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '~/models/base-models/base.model';

@Entity({ name: 'animeCoverImages' })
@ObjectType()
export class AnimeCoverImage extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  extraLarge?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  large?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  medium?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  color?: string;
}
