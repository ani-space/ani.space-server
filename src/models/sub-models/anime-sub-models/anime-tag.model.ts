import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Anime } from '../../anime.model';

@Entity({ name: 'animeTags' })
@ObjectType()
export class AnimeTag {
  @Field(() => Int)
  @PrimaryColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  category?: string;

  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  rank: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isGeneralSpoiler?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isMediaSpoiler?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isAdult?: boolean;
}
