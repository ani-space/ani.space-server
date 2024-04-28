import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';
import { BaseEntity } from './base-models';

@ObjectType()
@Entity({ name: 'reviews' })
export class Review extends BaseEntity {}
