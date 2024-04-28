import { registerEnumType } from '@nestjs/graphql';

export enum ExternalLinkType {
  INFO = 'INFO',
  STREAMING = 'STREAMING',
  SOCIAL = 'SOCIAL',
}

registerEnumType(ExternalLinkType, {
  name: 'ExternalLinkType',
});
