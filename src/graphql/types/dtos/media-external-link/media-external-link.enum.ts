import { registerEnumType } from '@nestjs/graphql';

export enum MediaExternalLinkSite {
  GOGO_ANIME = 'GogoAnime',
  ANIME_HAY = 'AnimeHay',
  ANIME_VSUB = 'AnimeVSub',
}

export enum MediaExternalLinkLanguage {
  VIETNAMESE = 'Vietnamese',
  ENGLISH = 'English',
}

registerEnumType(MediaExternalLinkLanguage, {
  name: 'MediaExternalLinkLanguage',
});

registerEnumType(MediaExternalLinkSite, {
  name: 'MediaExternalLinkSite',
});
