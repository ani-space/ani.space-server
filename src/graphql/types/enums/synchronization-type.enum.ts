import { registerEnumType } from '@nestjs/graphql';

export enum SynchronizedAnimeEnum {
  ANIME_SCALAR_TYPE = 'ANIME_SCALAR_TYPE',
}

registerEnumType(SynchronizedAnimeEnum, {
  name: 'SynchronizedAnimeEnum',
});
