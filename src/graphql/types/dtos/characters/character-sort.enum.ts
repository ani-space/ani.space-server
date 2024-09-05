import { registerEnumType } from '@nestjs/graphql';

export enum CharacterSortEnum {
  ID = 'ID',
  ID_DESC = 'ID_DESC',
  ROLE = 'ROLE',
  ROLE_DESC = 'ROLE_DESC',
  NAME = 'NAME',
  NAME_DESC = 'NAME_DESC',
}

registerEnumType(CharacterSortEnum, {
  name: 'CharacterSort',
});
