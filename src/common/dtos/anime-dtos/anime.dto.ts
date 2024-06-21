import { AutoMap } from '@automapper/classes';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  AnimeFormat,
  AnimeSeason,
  AnimeSource,
  AnimeStatus,
} from '../../../models/sub-models/anime-sub-models';
import { AiringScheduleConnectionDto } from '../airing-schedules-dtos/airing-schedule-connection.dto';
import { AiringScheduleDto } from '../airing-schedules-dtos/airing-schedule.dto';
import { BaseAnilistDto } from '../base-dtos/base-anilist.dto';
import { FuzzyDateIntDto } from '../common-dtos/fuzzy-date-int.dto';
import { AnimeConnectionDto } from './anime-connection.dto';
import { AnimeCoverImageDto } from './anime-cover-image.dto';
import { AnimeDescriptionDto } from './anime-description.dto';
import { AnimeGenresDto } from './anime-genre.dto';
import { AnimeRankDto } from './anime-rank.dto';
import { AnimeSynonymsDto } from './anime-synonyms.dto';
import { AnimeTagDto } from './anime-tag.dto';
import { AnimeTitleDto } from './anime-title.dto';
import { AnimeTrailerDto } from './anime-trailer.dto';
import { AnimeTrendConnectionDto } from './anime-trend-connection.dto';

@ObjectType()
export class AnimeDto extends BaseAnilistDto {
  @AutoMap()
  @Field((type) => Int, { nullable: true })
  idMal: number;

  @AutoMap(() => FuzzyDateIntDto)
  @Field((type) => FuzzyDateIntDto, { nullable: true })
  startDate?: FuzzyDateIntDto;

  @AutoMap(() => FuzzyDateIntDto)
  @Field((type) => FuzzyDateIntDto, { nullable: true })
  endDate?: FuzzyDateIntDto;

  @AutoMap(() => AnimeTitleDto)
  @Field((type) => AnimeTitleDto, { nullable: true })
  title?: AnimeTitleDto;

  @AutoMap()
  @Field((type) => AnimeFormat, { nullable: true })
  format?: string;

  @AutoMap()
  @Field((type) => AnimeStatus, { nullable: true })
  status?: string;

  @AutoMap(() => AnimeDescriptionDto)
  @Field((type) => AnimeDescriptionDto, { nullable: true })
  description?: AnimeDescriptionDto;

  @AutoMap()
  @Field((type) => AnimeSeason, { nullable: true })
  season?: string;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  seasonYear?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  seasonInt?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  episodes?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  duration?: number;

  @AutoMap()
  @Field({ nullable: true })
  countryOfOrigin?: string;

  @AutoMap()
  @Field({ nullable: true })
  isLicensed?: boolean;

  @AutoMap()
  @Field((type) => AnimeSource, { nullable: true })
  source?: string;

  @AutoMap()
  @Field({ nullable: true })
  hashtag?: string;

  @AutoMap(() => AnimeTrailerDto)
  @Field((type) => AnimeTrailerDto, { nullable: true })
  trailer?: AnimeTrailerDto;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  updateAt?: number;

  @AutoMap(() => AnimeCoverImageDto)
  @Field((type) => AnimeCoverImageDto, { nullable: true })
  coverImage?: AnimeCoverImageDto;

  @AutoMap()
  @Field({ nullable: true })
  bannerImage?: string;

  @AutoMap(() => [AnimeGenresDto])
  @Field((type) => [AnimeGenresDto], { nullable: true })
  genres?: AnimeGenresDto[];

  @AutoMap(() => [AnimeSynonymsDto])
  @Field((type) => [AnimeSynonymsDto], { nullable: true })
  synonyms?: AnimeSynonymsDto[];

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  averageScore?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  meanScore?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  popularity?: number;

  @AutoMap(() => [AnimeTagDto])
  @Field((type) => [AnimeTagDto], { nullable: true })
  tags?: AnimeTagDto[];

  @AutoMap(() => AnimeConnectionDto)
  @Field((type) => AnimeConnectionDto, { nullable: true })
  relations?: AnimeConnectionDto;

  //TODO: define characters?: CharacterConnectionDto;

  //TODO: define staff?: StaffConnectionDTO;

  //TODO: define studios?: StudioConnection;

  @AutoMap()
  @Field({ nullable: true })
  isAdult?: boolean;

  @AutoMap(() => AiringScheduleDto)
  @Field((type) => AiringScheduleDto, {
    nullable: true,
    description: `The media's next episode airing schedule`,
  })
  nextAiringEpisode?: AiringScheduleDto;

  @AutoMap(() => AiringScheduleConnectionDto)
  @Field((type) => AiringScheduleConnectionDto, {
    nullable: true,
    description: `The media's entire airing schedule`,
  })
  airingSchedule?: AiringScheduleConnectionDto;

  @AutoMap(() => AnimeTrendConnectionDto)
  @Field((type) => AnimeTrendConnectionDto, {
    nullable: true,
    description: `The media's daily trend stats`,
  })
  trends?: AnimeTrendConnectionDto;

  // TODO: define mediaExternalLink?: MediaExternalLink[];

  @AutoMap(() => [AnimeRankDto])
  @Field((type) => [AnimeRankDto], {
    nullable: true,
    description: `The ranking of the media in a particular time span and format compared to other media`,
  })
  rankings: AnimeRankDto[];
}
