import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
@ObjectType()
export class QueryStreamingEpisodeSourceArg {
  @Field()
  animeStreamingEpisodeId: string;

  @Field({ nullable: true })
  id?: string;
}
