import { ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '~/graphql/types/dtos/error-response.interface';

@ObjectType('UnauthorizedError', {
  implements: [ErrorResponse],
})
export class UnauthorizedError extends ErrorResponse {
  constructor() {
    super('Unauthorized Error');
  }
}
