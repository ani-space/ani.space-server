import { Inject } from '@nestjs/common';
import {
  Args,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { IAnimeService } from '~/contracts/services';
import { MediaExternalLink } from '~/models/media-external-link.model';

@InputType()
export class MutateMedia {
  @Field()
  action: string;

  @Field({ nullable: true })
  mid?: string;

  @Field({ nullable: true })
  actualLink?: string;

  @Field({ nullable: true })
  idAnilist?: string;

  @Field({ nullable: true })
  animePath?: string;
}

@Resolver()
export class MediaResolver {
  constructor(
    @Inject(IAnimeService) private readonly animeService: IAnimeService,
  ) {}

  @Query(() => [MediaExternalLink], { name: 'GetMediaExternalLinkList' })
  public async getMediaExternalLink() {
    return this.animeService.getMediaExternalLinkList();
  }

  @Mutation(() => String, { name: 'MutateMediaExternalLink' })
  public async handleMutateMedia(@Args('input') input: MutateMedia) {
    const { action, mid, actualLink, idAnilist, animePath } = input;
    await this.animeService.mutateMediaExternalLink(
      action,
      String(mid),
      actualLink,
      idAnilist,
      animePath,
    );

    return 'ok';
  }
}
