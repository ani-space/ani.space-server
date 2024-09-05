import { Field, ObjectType } from '@nestjs/graphql';
import { QueryAnimeArg } from '../../args/query-anime.arg';
import { ErrorResponse } from '../error-response.interface';

@ObjectType({
  implements: [ErrorResponse],
})
export class NotFoundAnimeError extends ErrorResponse {
  @Field((types) => QueryAnimeArg)
  requestObject: QueryAnimeArg;

  constructor(partial?: Partial<NotFoundAnimeError>) {
    super('Anime not found');
    Object.assign(this, partial);
  }
}
