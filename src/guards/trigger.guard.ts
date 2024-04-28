import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { TriggerConfig } from '../configs/index';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class TriggerGuard implements CanActivate {
  constructor(
    @Inject(TriggerConfig.KEY)
    private readonly triggerConf: ConfigType<typeof TriggerConfig>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;
    const { authorization } = req.headers;
    const secret = this.triggerConf.secret;

    return secret === authorization;
  }
}
