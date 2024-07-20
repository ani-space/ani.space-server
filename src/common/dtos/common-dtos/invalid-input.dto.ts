import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '~/graphql/types/dtos/error-response.interface';

@ObjectType()
export class InputError {
  @Field()
  field: string;

  @Field((_type) => [String])
  messages: string[];
}

@ObjectType('InvalidInputError', {
  implements: [ErrorResponse],
})
export class InvalidInputError extends ErrorResponse {
  @Field((_type) => [InputError])
  errors: InputError[];

  constructor(errors: InputError[]) {
    super('Invalid input provided.');
    this.errors = errors;
  }
}
