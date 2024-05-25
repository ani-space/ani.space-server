import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Index } from 'typeorm';
import { IBaseAnilist } from '../contracts';
import { BaseEntity } from './base.model';

@ObjectType()
export abstract class BaseAnilistEntity
  extends BaseEntity
  implements IBaseAnilist
{
  @Index({ unique: true })
  @Column()
  @Field((type) => Int)
  idAnilist: number;
}
