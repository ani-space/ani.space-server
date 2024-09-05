import { registerEnumType } from '@nestjs/graphql';

export enum AnimeStatus {
  FINISHED = 'FINISHED',
  RELEASING = 'RELEASING',
  NOT_YET_RELEASED = 'NOT_YET_RELEASED',
  CANCELLED = 'CANCELLED',
  HIATUS = 'HIATUS',
}

registerEnumType(AnimeStatus, {
  name: 'AnimeStatus',
});
