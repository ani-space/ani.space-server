import { Module, Provider } from '@nestjs/common';
import {
  IAnimeGenreRepository,
  IAnimeRepository,
  IAnimeTagRepository,
} from '~/contracts/repositories';
import {
  IAnimeGenreService,
  IAnimeService,
  IAnimeTagService,
} from '~/contracts/services';
import {
  AnimeGenreRepository,
  AnimeRepository,
  AnimeTagRepository,
} from '~/repositories';
import { AnimeGenreService, AnimeService, AnimeTagService } from '~/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anime } from '~/models';
import { AnimeGenres, AnimeTag } from '~/models/sub-models/anime-sub-models';

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

@Module({
  imports: [TypeOrmModule.forFeature([Anime, AnimeGenres, AnimeTag])],
  providers: [
    animeRepoProvider,
    animeServiceProvider,
    animeGenreRepoProvider,
    animeGenreServiceProvider,
    animeTagRepoProvider,
    animeTagServiceProvider,
  ],
  exports: [
    animeRepoProvider,
    animeServiceProvider,
    animeGenreRepoProvider,
    animeGenreServiceProvider,
    animeTagRepoProvider,
    animeTagServiceProvider,
  ],
})
export class MediaModule {}
