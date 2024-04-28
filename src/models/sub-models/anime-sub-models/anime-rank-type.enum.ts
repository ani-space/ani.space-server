import { registerEnumType } from '@nestjs/graphql';

export enum AnimeRankType {
  RATED = 'RATED',
  POPULAR = 'POPULAR',
}

registerEnumType(AnimeRankType, {
  name: 'AnimeRankType',
});
