import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import {
  AnimeFormat,
  AnimeSeason,
  AnimeSource,
  AnimeStatus,
} from '~/models/sub-models/anime-sub-models';
import { AnimeSortEnum } from '../dtos/anime-response/anime-sort.enum';
import { PaginationArgs } from './pagination.arg';
import { Min, IsOptional, Max } from 'class-validator';

@ArgsType()
@ObjectType()
export class QueryAnimePageArg extends PaginationArgs {
  @Field({ nullable: true })
  titleTerm?: string;

  @Field(() => AnimeSortEnum, { nullable: true })
  sort?: AnimeSortEnum;

  @Field(() => AnimeFormat, { nullable: true })
  format?: AnimeFormat;

  @Field(() => [AnimeFormat], { nullable: true })
  formatIn?: AnimeFormat[];

  @Field(() => [AnimeFormat], { nullable: true })
  formatNotIn?: AnimeFormat[];

  @Field(() => AnimeStatus, { nullable: true })
  status?: AnimeStatus;

  @Field(() => [AnimeStatus], { nullable: true })
  statusIn?: AnimeStatus[];

  @Field(() => [AnimeStatus], { nullable: true })
  statusNotIn?: AnimeStatus[];

  @Field(() => AnimeSeason, { nullable: true })
  season?: AnimeSeason;

  @Field(() => [AnimeSeason], { nullable: true })
  seasonIn?: AnimeSeason[];

  @Field(() => [AnimeSeason], { nullable: true })
  seasonNotIn?: AnimeSeason[];

  @Field(() => AnimeSource, { nullable: true })
  source?: AnimeSource;

  @Field(() => [AnimeSource], { nullable: true })
  sourceIn?: AnimeSource[];

  @Field(() => [AnimeSource], { nullable: true })
  sourceNotIn?: AnimeSource[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(4)
  seasonYear?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(4)
  seasonYearGreater?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(4)
  seasonYearLesser?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  episodes?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  episodesGreater?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(2)
  episodesLesser?: number;

  @Field({ nullable: true })
  countryOfOrigin?: string;

  @Field(() => [String], { nullable: true })
  genresIn?: string[];

  @Field(() => [String], { nullable: true })
  genresNotIn?: string[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  duration?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  durationGreater?: number;

  @IsOptional()
  @Min(1)
  @Field(() => Int, { nullable: true })
  durationLesser?: number;

  @Field({ nullable: true })
  isAdult?: boolean;

  @Field(() => Int, {
    nullable: true,
    description:
      '8 digit long date integer (YYYYMMDD). Unknown dates represented by 0. E.g. 2016: 20160000, May 1976: 19760500',
  })
  @Min(4)
  @Max(8)
  @IsOptional()
  startDate?: number;

  @Field(() => Int, {
    nullable: true,
    description:
      '8 digit long date integer (YYYYMMDD). Unknown dates represented by 0. E.g. 2016: 20160000, May 1976: 19760500',
  })
  @Min(4)
  @Max(8)
  @IsOptional()
  startDateGreater?: number;

  @Field(() => Int, {
    nullable: true,
    description:
      '8 digit long date integer (YYYYMMDD). Unknown dates represented by 0. E.g. 2016: 20160000, May 1976: 19760500',
  })
  @Min(4)
  @Max(8)
  @IsOptional()
  startDateLesser?: number;

  @Field(() => Int, {
    nullable: true,
    description:
      '8 digit long date integer (YYYYMMDD). Unknown dates represented by 0. E.g. 2016: 20160000, May 1976: 19760500',
  })
  @Min(4)
  @Max(8)
  @IsOptional()
  endDate?: number;

  @Field(() => Int, {
    nullable: true,
    description:
      '8 digit long date integer (YYYYMMDD). Unknown dates represented by 0. E.g. 2016: 20160000, May 1976: 19760500',
  })
  @Min(4)
  @Max(8)
  @IsOptional()
  endDateGreater?: number;

  @Field(() => Int, {
    nullable: true,
    description:
      '8 digit long date integer (YYYYMMDD). Unknown dates represented by 0. E.g. 2016: 20160000, May 1976: 19760500',
  })
  @Min(4)
  @Max(8)
  @IsOptional()
  endDateLesser?: number;
}
