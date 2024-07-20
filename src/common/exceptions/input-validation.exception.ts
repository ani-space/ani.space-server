import { InputError } from '../dtos/common-dtos/invalid-input.dto';

export class InputValidationException extends Error {
  errors: InputError[];

  constructor(errors: InputError[]) {
    super();
    this.errors = errors;
  }
}
