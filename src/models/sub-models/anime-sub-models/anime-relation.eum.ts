import { registerEnumType } from '@nestjs/graphql';
export enum AnimeRelation {
  ADAPTATION = 'ADAPTATION',

  PREQUEL = 'PREQUEL',

  SEQUEL = 'SEQUEL',

  PARENT = 'PARENT',

  SIDE_STORY = 'SIDE_STORY',

  CHARACTER = 'CHARACTER',

  SUMMARY = 'SUMMARY',

  ALTERNATIVE = 'ALTERNATIVE',

  SPIN_OFF = 'SPIN_OFF',

  OTHER = 'OTHER',

  SOURCE = 'SOURCE',

  COMPILATION = 'COMPILATION',

  CONTAINS = 'CONTAINS',
}

registerEnumType(AnimeRelation, {
  name: 'AnimeRelation',
  description: 'Type of relation media has to its parent.',
  valuesMap: {
    ADAPTATION: {
      description: 'An adaption of this media into a different format',
    },
    PREQUEL: {
      description: 'Released before the relation',
    },
    SEQUEL: {
      description: 'Released after the relation',
    },
    PARENT: {
      description: 'The media a side story is from',
    },
    SIDE_STORY: {
      description: 'A side story of the parent media',
    },
    CHARACTER: {
      description: 'Shares at least 1 character',
    },
    SUMMARY: {
      description: 'A shortened and summarized version',
    },
    ALTERNATIVE: {
      description: 'An alternative version of the same media',
    },
    SPIN_OFF: {
      description:
        'An alternative version of the media with a different primary focus',
    },
    OTHER: {
      description: 'Other',
    },
    SOURCE: {
      description: 'The source material the media was adapted from',
    },
  },
});
