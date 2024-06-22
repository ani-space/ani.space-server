import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '~/models/base-models/base.model';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'animeCoverImages' })
@ObjectType()
export class AnimeCoverImage extends BaseEntity {
  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  extraLarge?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  large?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  medium?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  color?: string;
}
