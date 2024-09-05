import { registerEnumType } from '@nestjs/graphql';

export enum StaffSortEnum {
  ID = 'ID',
  ID_DESC = 'ID_DESC',
  ROLE = 'ROLE',
  ROLE_DESC = 'ROLE_DESC',
  LANGUAGE = 'LANGUAGE',
  LANGUAGE_DESC = 'LANGUAGE_DESC',
}

registerEnumType(StaffSortEnum, {
  name: 'StaffSortEnum',
});
