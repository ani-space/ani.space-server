import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { InputValidationException } from '../exceptions/input-validation.exception';
import { InvalidInputError } from '../dtos/common-dtos/invalid-input.dto';

@Catch(InputValidationException)
export class InputValidationExceptionFilter implements GqlExceptionFilter {
  catch(exception: InputValidationException, host: ArgumentsHost) {
    const { errors } = exception;
    const resp = new InvalidInputError(errors);
    return [resp];
  }
}
