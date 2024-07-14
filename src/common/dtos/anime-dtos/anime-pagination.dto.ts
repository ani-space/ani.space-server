import { ObjectType } from '@nestjs/graphql';
import { IPageInfo } from '~/models/contracts';
import { PaginateResult } from '../paginate-result.dto';
import { AnimeDto } from './anime.dto';

@ObjectType()
export class AnimeListPageDto extends PaginateResult(AnimeDto) {
  constructor(animeList: AnimeDto[], pageInfo: IPageInfo) {
    super();
    this.docs = animeList;
    this.pageInfo = pageInfo;
  }
}
