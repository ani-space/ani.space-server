import { Field, ObjectType } from '@nestjs/graphql';
import { QueryStaffArg } from '../../args/query-staff.arg';
import { ErrorResponse } from '../error-response.interface';

@ObjectType({
  implements: [ErrorResponse],
})
export class NotFoundStaffError extends ErrorResponse {
  @Field((types) => QueryStaffArg)
  requestObject: QueryStaffArg;

  constructor(partial?: Partial<NotFoundStaffError>) {
    super('Staff not found');
    Object.assign(this, partial);
  }
}
