import { Module } from '@nestjs/common';
import { IAnimeRepository } from '~/contracts/repositories';
import { IAnimeService } from '~/contracts/services';
import { AnimeRepository } from '~/repositories';
import { AnimeService } from '~/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anime } from '~/models';

@Module({
  imports: [TypeOrmModule.forFeature([Anime])],
  providers: [
    {
      provide: IAnimeRepository,
      useClass: AnimeRepository,
    },
    {
      provide: IAnimeService,
      useClass: AnimeService,
    },
  ],
  exports: [
    {
      provide: IAnimeRepository,
      useClass: AnimeRepository,
    },
    {
      provide: IAnimeService,
      useClass: AnimeService,
    },
  ],
})
export class MediaModule {}
