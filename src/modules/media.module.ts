import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  IAnimeGenreRepository,
  IAnimeRepository,
  IAnimeTagRepository,
  ICharacterRepository,
} from '~/contracts/repositories';
import {
  IAnimeGenreService,
  IAnimeService,
  IAnimeTagService,
  ICharacterService,
  IStaffService,
} from '~/contracts/services';
import { Anime, Character, CharacterEdge, Staff } from '~/models';
import { AnimeEdge } from '~/models/anime-edge.model';
import {
  AnimeConnection,
  AnimeGenres,
  AnimeTag,
} from '~/models/sub-models/anime-sub-models';
import { CharacterConnection } from '~/models/sub-models/character-sub-models';
import { StaffName } from '~/models/sub-models/staff-sub-models';
import { StaffRoleType } from '~/models/sub-models/staff-sub-models/staff-role-type.model';
import {
  AnimeGenreRepository,
  AnimeRepository,
  AnimeTagRepository,
  CharacterRepository,
} from '~/repositories';
import {
  AnimeGenreService,
  AnimeService,
  AnimeTagService,
  StaffService,
} from '~/services';
import { CharacterService } from '~/services/character.service';
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

const animeRepoProvider: Provider = {
  provide: IAnimeRepository,
  useClass: AnimeRepository,
};
const animeServiceProvider: Provider = {
  provide: IAnimeService,
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
const characterServiceProvider: Provider = {
  provide: ICharacterService,
  useClass: CharacterService,
};
const staffServiceProvider: Provider = {
  provide: IStaffService,
  useClass: StaffService,
};

@Module({
  imports: [
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
      StaffImage,
    ]),
  ],
  providers: [
    animeRepoProvider,
    animeServiceProvider,
    animeGenreRepoProvider,
    animeGenreServiceProvider,
    animeTagRepoProvider,
    animeTagServiceProvider,

    characterRepoProvider,
    characterServiceProvider,

    staffServiceProvider,
  ],
  exports: [
    animeRepoProvider,
    animeServiceProvider,
    animeGenreRepoProvider,
    animeGenreServiceProvider,
    animeTagRepoProvider,
    animeTagServiceProvider,

    characterRepoProvider,
    characterServiceProvider,

    staffServiceProvider,
  ],
})
export class MediaModule {}
