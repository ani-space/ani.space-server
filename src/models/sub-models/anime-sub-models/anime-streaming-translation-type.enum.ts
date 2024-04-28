import { registerEnumType } from '@nestjs/graphql';

export enum TranslationType {
  DUBBING_TRANSLATION = 'DUBBING_TRANSLATION',
  SUBBING_TRANSLATION = 'SUBBING_TRANSLATION',
}

registerEnumType(TranslationType, {
  name: 'TranslationType',
});
