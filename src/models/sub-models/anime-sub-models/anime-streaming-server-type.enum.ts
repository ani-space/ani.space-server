import { registerEnumType } from '@nestjs/graphql';

export enum ServerType {
  PRIMARY = 'PRIMARY',
  FALLBACK = 'FALLBACK',
}

registerEnumType(ServerType, {
  name: 'ServerType',
});
