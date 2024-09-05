import { AutoMap } from '@automapper/classes';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AnimeFormat } from '../../../models/sub-models/anime-sub-models/anime-format.enum';
import { AnimeRankType } from '../../../models/sub-models/anime-sub-models/anime-rank-type.enum';
import { AnimeSeason } from '../../../models/sub-models/anime-sub-models/anime-season.enum';
import { BaseAnilistDto } from '../base-dtos/base-anilist.dto';

@ObjectType()
export class AnimeRankDto extends BaseAnilistDto {
  @AutoMap()
  @Field(() => Int, { description: `The numerical rank of the media` })
  rank: number;

  @AutoMap()
  @Field(() => AnimeRankType)
  type: string;

  @AutoMap()
  @Field(() => AnimeFormat)
  format: string;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  year?: number;

  @AutoMap()
  @Field((type) => AnimeSeason, { nullable: true })
  season?: string;

  @AutoMap()
  @Field({
    description: `If the ranking is based on all time instead of a season/year`,
  })
  allTime?: boolean;

  @AutoMap()
  @Field({
    description: `String that gives context to the ranking type and time span`,
  })
  context: string;
}
