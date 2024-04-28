import { registerEnumType } from '@nestjs/graphql';

export enum AnimeFormat {
  TV = 'TV',
  TV_SHORT = 'TV_SHORT',
  MOVIE = 'MOVIE',
  SPECIAL = 'SPECIAL',
  OVA = 'OVA',
  ONA = 'ONA',
  MUSIC = 'MUSIC',
}

registerEnumType(AnimeFormat, {
  name: 'AnimeFormat',
});
