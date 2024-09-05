import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class ErrorResponse {
  @Field()
  errorMessage: string;

  protected constructor(message?: string) {
    if (message) {
      this.errorMessage = message;
    }
  }
}
