import { registerEnumType } from '@nestjs/graphql';

export enum AnimeSeason {
  WINTER = 'WINTER',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
}

registerEnumType(AnimeSeason, {
  name: 'AnimeSeason',
});
