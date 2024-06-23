import { createUnionType } from '@nestjs/graphql';
import { AnimeDto } from '~/common/dtos/anime-dtos/anime.dto';
import { NotFoundAnimeError } from './not-found-anime.error';

export const AnimeResultUnion = createUnionType({
  name: 'AnimeResult',
  types: () => [AnimeDto, NotFoundAnimeError],
});
