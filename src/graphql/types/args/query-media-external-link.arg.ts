import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import {
  MediaExternalLinkLanguage,
  MediaExternalLinkSite,
} from '../dtos/media-external-link/media-external-link.enum';

@ArgsType()
@ObjectType()
export class QueryMediaExternalLinkArg {
  @Field(() => MediaExternalLinkSite, { nullable: true })
  site?: MediaExternalLinkSite;

  @Field(() => MediaExternalLinkLanguage, { nullable: true })
  language?: MediaExternalLinkLanguage;
}
