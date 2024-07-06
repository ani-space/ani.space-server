import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudioProfile } from '~/common/mapper-profiles/studio-profile';
import {
  IAnimeGenreRepository,
  IAnimeRepository,
  IAnimeTagRepository,
  ICharacterRepository,
  IStaffRepository,
  IStudioRepository,
} from '~/contracts/repositories';
import {
  IAnimeExternalService,
  IAnimeGenreService,
  IAnimeInternalService,
  IAnimeTagService,
  ICharacterExternalService,
  ICharacterInternalService,
  IStaffExternalService,
  IStaffInternalService,
  IStudioExternalService,
  IStudioInternalService,
} from '~/contracts/services';
import { AnimeStreamingEpisodeSourceResolver } from '~/graphql/resolvers/anime-streaming-episode-source.resolver';
import { CharacterResolver } from '~/graphql/resolvers/character.resolver';
import { MediaResolver } from '~/graphql/resolvers/media.resolver';
import { StaffResolver } from '~/graphql/resolvers/staff.resolver';
import { StudioResolver } from '~/graphql/resolvers/studio.resolver';
import { Anime, Character, CharacterEdge, Staff, StaffEdge } from '~/models';
import { AnimeEdge } from '~/models/anime-edge.model';
import { StudioEdge } from '~/models/studio-edge.model';
import { Studio } from '~/models/studio.model';
import {
  AnimeConnection,
  AnimeGenres,
  AnimeTag,
} from '~/models/sub-models/anime-sub-models';
import { AnimeStreamingEpisodeSource } from '~/models/sub-models/anime-sub-models/anime-streaming-episode-sources.model';
import { AnimeStreamingEpisode } from '~/models/sub-models/anime-sub-models/anime-streaming-episode.model';
import { CharacterConnection } from '~/models/sub-models/character-sub-models';
import { StaffName } from '~/models/sub-models/staff-sub-models';
import { StaffConnection } from '~/models/sub-models/staff-sub-models/staff-connection.model';
import { StaffRoleType } from '~/models/sub-models/staff-sub-models/staff-role-type.model';
import { StudioConnection } from '~/models/sub-models/studio-sub-models/studio-connection.model';
import {
  AnimeGenreRepository,
  AnimeRepository,
  AnimeTagRepository,
  CharacterRepository,
  StudioRepository,
} from '~/repositories';
import { StaffRepository } from '~/repositories/staff.repository';
import {
  AnimeGenreService,
  AnimeService,
  AnimeTagService,
  StaffService,
} from '~/services';
import { CharacterService } from '~/services/character.service';
import { AnimeProfile } from '../common/mapper-profiles/anime-profile';
import { CharacterProfile } from '../common/mapper-profiles/character-profile';
import { CommonProfile } from '../common/mapper-profiles/common-profile';
import { StaffProfile } from '../common/mapper-profiles/staff-profile';
import { MediaExternalLink } from '../models/media-external-link.model';
import {
  AnimeCoverImage,
  AnimeDescription,
  AnimeSynonyms,
  AnimeTitle,
  AnimeTrailer,
} from '../models/sub-models/anime-sub-models';
import {
  CharacterImage,
  CharacterName,
} from '../models/sub-models/character-sub-models';
import { CharacterAlternative } from '../models/sub-models/character-sub-models/character-alternative.model';
import { CharacterAlternativeSpoilers } from '../models/sub-models/character-sub-models/character-alternativeSpoiler.model';
import {
  StaffImage,
  StaffPrimaryOccupation,
} from '../models/sub-models/staff-sub-models';
import { StaffAlternative } from '../models/sub-models/staff-sub-models/staff-name-alternative.model';
import { StaffYearActive } from '../models/sub-models/staff-sub-models/staff-year-active.model';
import { StudioService } from '../services/studio.service';
import { LoggerModule } from './logger.module';

const animeRepoProvider: Provider = {
  provide: IAnimeRepository,
  useClass: AnimeRepository,
};
const animeServiceProvider: Provider = {
  provide: IAnimeInternalService,
  useClass: AnimeService,
};
const animeServiceExternalProvider: Provider = {
  provide: IAnimeExternalService,
  useClass: AnimeService,
};
const animeGenreRepoProvider: Provider = {
  provide: IAnimeGenreRepository,
  useClass: AnimeGenreRepository,
};
const animeGenreServiceProvider: Provider = {
  provide: IAnimeGenreService,
  useClass: AnimeGenreService,
};
const animeTagRepoProvider: Provider = {
  provide: IAnimeTagRepository,
  useClass: AnimeTagRepository,
};
const animeTagServiceProvider: Provider = {
  provide: IAnimeTagService,
  useClass: AnimeTagService,
};
const characterRepoProvider: Provider = {
  provide: ICharacterRepository,
  useClass: CharacterRepository,
};
const staffRepoProvider: Provider = {
  provide: IStaffRepository,
  useClass: StaffRepository,
};
const characterInternalServiceProvider: Provider = {
  provide: ICharacterInternalService,
  useClass: CharacterService,
};
const characterExternalServiceProvider: Provider = {
  provide: ICharacterExternalService,
  useClass: CharacterService,
};
const staffInternalServiceProvider: Provider = {
  provide: IStaffInternalService,
  useClass: StaffService,
};
const staffExternalServiceProvider: Provider = {
  provide: IStaffExternalService,
  useClass: StaffService,
};
const studioRepositoryProvider: Provider = {
  provide: IStudioRepository,
  useClass: StudioRepository,
};
const studioInternalServiceProvider: Provider = {
  provide: IStudioInternalService,
  useClass: StudioService,
};
const studioExternalServiceProvider: Provider = {
  provide: IStudioExternalService,
  useClass: StudioService,
};

@Module({
  imports: [
    LoggerModule,

    TypeOrmModule.forFeature([
      Anime,
      AnimeEdge,
      AnimeGenres,
      AnimeTag,
      AnimeTitle,
      AnimeSynonyms,
      AnimeCoverImage,
      AnimeTrailer,
      AnimeDescription,
      AnimeConnection,
      AnimeStreamingEpisode,
      AnimeStreamingEpisodeSource,

      Character,
      CharacterEdge,
      CharacterConnection,
      CharacterAlternative,
      CharacterAlternativeSpoilers,
      CharacterName,
      CharacterImage,

      Staff,
      StaffName,
      StaffRoleType,
      StaffAlternative,
      StaffYearActive,
      StaffPrimaryOccupation,
      StaffConnection,
      StaffEdge,
      StaffImage,

      Studio,
      StudioEdge,
      StudioConnection,

      MediaExternalLink,
    ]),
  ],
  providers: [
    CommonProfile,
    AnimeProfile,
    CharacterProfile,
    StaffProfile,
    StudioProfile,

    MediaResolver,
    AnimeStreamingEpisodeSourceResolver,
    CharacterResolver,
    StaffResolver,
    StudioResolver,

    animeRepoProvider,
    animeServiceProvider,
    animeServiceExternalProvider,
    animeGenreRepoProvider,
    animeGenreServiceProvider,
    animeTagRepoProvider,
    animeTagServiceProvider,

    characterRepoProvider,
    characterInternalServiceProvider,
    characterExternalServiceProvider,

    staffRepoProvider,
    staffInternalServiceProvider,
    staffExternalServiceProvider,

    studioInternalServiceProvider,
    studioExternalServiceProvider,
    studioRepositoryProvider,
  ],
  exports: [
    animeRepoProvider,
    animeServiceProvider,
    animeGenreRepoProvider,
    animeGenreServiceProvider,
    animeTagRepoProvider,
    animeTagServiceProvider,

    characterRepoProvider,
    characterInternalServiceProvider,
    characterExternalServiceProvider,

    staffRepoProvider,
    staffInternalServiceProvider,
    staffExternalServiceProvider,

    studioInternalServiceProvider,
    studioExternalServiceProvider,
    studioRepositoryProvider,
  ],
})
export class MediaModule {}
