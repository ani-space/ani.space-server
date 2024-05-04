import { Module, Provider } from '@nestjs/common';
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
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anime, Character, CharacterEdge, Staff } from '~/models';
import { AnimeGenres, AnimeTag } from '~/models/sub-models/anime-sub-models';
import { CharacterService } from '~/services/character.service';
import { CharacterConnection } from '~/models/sub-models/character-sub-models';
import { CharacterAlternative } from '../models/sub-models/character-sub-models/character-alternative.model';
import {
  CharacterName,
  CharacterImage,
} from '../models/sub-models/character-sub-models';
import { StaffName } from '~/models/sub-models/staff-sub-models';
import { StaffAlternative } from '../models/sub-models/staff-sub-models/staff-name-alternative.model';
import { StaffYearActive } from '../models/sub-models/staff-sub-models/staff-year-active.model';
import {
  AnimeTitle,
  AnimeSynonyms,
  AnimeCoverImage,
  AnimeTrailer,
  AnimeDescription,
} from '../models/sub-models/anime-sub-models';
import {
  StaffImage,
  StaffPrimaryOccupation,
} from '../models/sub-models/staff-sub-models';
import { CharacterAlternativeSpoilers } from '../models/sub-models/character-sub-models/character-alternativeSpoiler.model';

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
      AnimeGenres,
      AnimeTag,
      AnimeTitle,
      AnimeSynonyms,
      AnimeCoverImage,
      AnimeTrailer,
      AnimeDescription,

      Character,
      CharacterEdge,
      CharacterConnection,
      CharacterAlternative,
      CharacterAlternativeSpoilers,
      CharacterName,
      CharacterImage,

      Staff,
      StaffName,
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
