import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../error-response.interface';
import { QueryCharacterArg } from '../../args/query-character.arg';

@ObjectType({
  implements: [ErrorResponse],
})
export class NotFoundCharacterError extends ErrorResponse {
  @Field((types) => QueryCharacterArg)
  requestObject: QueryCharacterArg;

  constructor(partial?: Partial<NotFoundCharacterError>) {
    super('Character not found');
    Object.assign(this, partial);
  }
}
