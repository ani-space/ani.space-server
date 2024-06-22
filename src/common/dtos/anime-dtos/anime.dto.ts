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
import { CharacterConnectionDto } from '../character-dtos/character-connection.dto';
import { FuzzyDateIntDto } from '../common-dtos/fuzzy-date-int.dto';
import { StaffConnectionDto } from '../staff-dtos/staff-connection.dto';
import { StudioConnectionDto } from '../studio-dtos/studio-connection.dto';
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
import { MediaExternalLinkDto } from './media-external-link.dto';

@ObjectType()
export class AnimeDto extends BaseAnilistDto {
  @AutoMap()
  @Field(() => Int, { nullable: true })
  idMal: number;

  @AutoMap(() => FuzzyDateIntDto)
  @Field(() => FuzzyDateIntDto, { nullable: true })
  startDate?: FuzzyDateIntDto;

  @AutoMap(() => FuzzyDateIntDto)
  @Field(() => FuzzyDateIntDto, { nullable: true })
  endDate?: FuzzyDateIntDto;

  @AutoMap(() => AnimeTitleDto)
  @Field(() => AnimeTitleDto, { nullable: true })
  title?: AnimeTitleDto;

  @AutoMap()
  @Field(() => AnimeFormat, { nullable: true })
  format?: string;

  @AutoMap()
  @Field(() => AnimeStatus, { nullable: true })
  status?: string;

  @AutoMap(() => AnimeDescriptionDto)
  @Field(() => AnimeDescriptionDto, { nullable: true })
  description?: AnimeDescriptionDto;

  @AutoMap()
  @Field(() => AnimeSeason, { nullable: true })
  season?: string;

  @AutoMap()
  @Field(() => Int, { nullable: true })
  seasonYear?: number;

  @AutoMap()
  @Field(() => Int, { nullable: true })
  seasonInt?: number;

  @AutoMap()
  @Field(() => Int, { nullable: true })
  episodes?: number;

  @AutoMap()
  @Field(() => Int, { nullable: true })
  duration?: number;

  @AutoMap()
  @Field({ nullable: true })
  countryOfOrigin?: string;

  @AutoMap()
  @Field({ nullable: true })
  isLicensed?: boolean;

  @AutoMap()
  @Field(() => AnimeSource, { nullable: true })
  source?: string;

  @AutoMap()
  @Field({ nullable: true })
  hashtag?: string;

  @AutoMap(() => AnimeTrailerDto)
  @Field(() => AnimeTrailerDto, { nullable: true })
  trailer?: AnimeTrailerDto;

  @AutoMap()
  @Field(() => Int, { nullable: true })
  updateAt?: number;

  @AutoMap(() => AnimeCoverImageDto)
  @Field(() => AnimeCoverImageDto, { nullable: true })
  coverImage?: AnimeCoverImageDto;

  @AutoMap()
  @Field({ nullable: true })
  bannerImage?: string;

  @AutoMap(() => [AnimeGenresDto])
  @Field(() => [AnimeGenresDto], { nullable: true })
  genres?: AnimeGenresDto[];

  @AutoMap(() => [AnimeSynonymsDto])
  @Field(() => [AnimeSynonymsDto], { nullable: true })
  synonyms?: AnimeSynonymsDto[];

  @AutoMap()
  @Field(() => Int, { nullable: true })
  averageScore?: number;

  @AutoMap()
  @Field(() => Int, { nullable: true })
  meanScore?: number;

  @AutoMap()
  @Field(() => Int, { nullable: true })
  popularity?: number;

  @AutoMap(() => [AnimeTagDto])
  @Field(() => [AnimeTagDto], { nullable: true })
  tags?: AnimeTagDto[];

  @AutoMap(() => AnimeConnectionDto)
  @Field((type) => AnimeConnectionDto, { nullable: true })
  relations?: AnimeConnectionDto;

  @AutoMap(() => CharacterConnectionDto)
  @Field(() => CharacterConnectionDto, { nullable: true })
  characters?: CharacterConnectionDto;

  @AutoMap(() => StaffConnectionDto)
  @Field(() => StaffConnectionDto, {
    nullable: true,
    description: `The staff who produced the media`,
  })
  staff?: StaffConnectionDto;

  @AutoMap(() => StudioConnectionDto)
  @Field(() => StudioConnectionDto, {
    nullable: true,
    description: `The companies who produced the media`,
  })
  studios?: StudioConnectionDto;

  @AutoMap()
  @Field({ nullable: true })
  isAdult?: boolean;

  @AutoMap(() => AiringScheduleDto)
  @Field(() => AiringScheduleDto, {
    nullable: true,
    description: `The media's next episode airing schedule`,
  })
  nextAiringEpisode?: AiringScheduleDto;

  @AutoMap(() => AiringScheduleConnectionDto)
  @Field(() => AiringScheduleConnectionDto, {
    nullable: true,
    description: `The media's entire airing schedule`,
  })
  airingSchedule?: AiringScheduleConnectionDto;

  @AutoMap(() => AnimeTrendConnectionDto)
  @Field(() => AnimeTrendConnectionDto, {
    nullable: true,
    description: `The media's daily trend stats`,
  })
  trends?: AnimeTrendConnectionDto;

  @AutoMap(() => MediaExternalLinkDto)
  @Field(() => MediaExternalLinkDto, {
    nullable: true,
    description: `On-demand streaming sources (May not be official!)`,
  })
  mediaExternalLink?: MediaExternalLinkDto[];

  @AutoMap(() => [AnimeRankDto])
  @Field(() => [AnimeRankDto], {
    nullable: true,
    description: `The ranking of the media in a particular time span and format compared to other media`,
  })
  rankings: AnimeRankDto[];
}
