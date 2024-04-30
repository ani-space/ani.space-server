import { Anime } from '~/models';
import { PaginateResult } from './paginate-result.dto';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AnimeListPage extends PaginateResult(Anime) {}
