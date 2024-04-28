import { registerEnumType } from '@nestjs/graphql';

export enum CharacterRole {
  MAIN = 'MAIN',
  SUPPORTING = 'SUPPORTING',
  BACKGROUND = 'BACKGROUND',
}

registerEnumType(CharacterRole, {
  name: 'CharacterRole',
});
