import { ArgumentsHost, Catch, UnauthorizedException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { UnauthorizedError } from '../dtos/common-dtos/unauthorized-error.dto';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements GqlExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    return [new UnauthorizedError()];
  }
}
