import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';

@ArgsType()
@ObjectType()
export class QueryAnimeArg {
  @Field({ nullable: true })
  id?: string;

  @Field(() => Int)
  idAnilist: number;

  @Field(() => Int, { nullable: true })
  idMal?: number;

  @Field({ nullable: true })
  romajiTitle?: string;

  @Field({ nullable: true, defaultValue: false })
  isAdult?: boolean;
}
