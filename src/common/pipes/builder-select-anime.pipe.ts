import { PipeTransform } from '@nestjs/common';
import { fieldsMap } from 'graphql-fields-list';
import {
  MapResultSelect,
  reverseBooleanValueInObj,
} from '../../utils/tools/object';
import { NotFoundAnimeError } from '../../graphql/types/dtos/anime-response/not-found-anime.error';
import { QueryAnimeArg } from '../../graphql/types/args/query-anime.arg';

export class BuilderSelectAnimePipe implements PipeTransform {
  transform(value: any): MapResultSelect {
    /*
     * We don't want get fields from Error query and pass to Select TypeORM
     */
    const fieldsToSkip = Object.getOwnPropertyNames(
      new NotFoundAnimeError({
        requestObject: new QueryAnimeArg(),
      }),
    );

    const mappedSelect = reverseBooleanValueInObj(
      fieldsMap(value, {
        skip: [
          ...fieldsToSkip,
          '__typename',
          'characters.pageInfo',
          'pageInfo',
        ],
      }),
    );

    return mappedSelect;
  }
}
