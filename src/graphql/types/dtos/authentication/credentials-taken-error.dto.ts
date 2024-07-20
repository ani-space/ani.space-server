import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../error-response.interface';

@ObjectType({
  implements: [ErrorResponse],
})
export class CredentialsTakenError extends ErrorResponse {
  @Field()
  providedEmail: string;

  @Field({ nullable: true })
  providedUsername?: string;

  constructor(partial?: Partial<CredentialsTakenError>) {
    super('Credentials are already taken.');
    Object.assign(this, partial);
  }
}
