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
     * We don't want get these fields then pass to Select TypeORM
     */
    const graphqlFieldsNeedToSkip = [
      '__typename',
      'characters.pageInfo',
      'staff.pageInfo',
      'studios.pageInfo',
      'airingSchedule.pageInfo',
      'pageInfo',
    ];
    const graphqlFieldsPagingToSkip = graphqlFieldsNeedToSkip.map(
      (e) => `docs.${e}`,
    );
    const fieldsToSkip = Object.getOwnPropertyNames(
      new NotFoundAnimeError({
        requestObject: new QueryAnimeArg(),
      }),
    );

    const mappedSelect = reverseBooleanValueInObj(
      fieldsMap(value, {
        skip: [
          ...fieldsToSkip,
          ...graphqlFieldsNeedToSkip,
          ...graphqlFieldsPagingToSkip,
        ],
      }),
    );

    return mappedSelect;
  }
}
