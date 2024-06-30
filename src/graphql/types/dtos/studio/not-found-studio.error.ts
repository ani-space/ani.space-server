import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../error-response.interface';
import { QueryStudioArg } from '../../args/query-studio.arg';

@ObjectType({
  implements: [ErrorResponse],
})
export class NotFoundStudioError extends ErrorResponse {
  @Field(() => QueryStudioArg)
  requestObject: QueryStudioArg;

  constructor(partial?: Partial<NotFoundStudioError>) {
    super('Studio not found');
    Object.assign(this, partial);
  }
}
