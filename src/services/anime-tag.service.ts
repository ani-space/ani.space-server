import { Injectable, Inject } from '@nestjs/common';
import { IAnimeTagRepository } from '~/contracts/repositories';
import { IAnimeTagService } from '~/contracts/services';
import { AnimeTag } from '~/models/sub-models/anime-sub-models';

@Injectable()
export class AnimeTagService implements IAnimeTagService {
  constructor(
    @Inject(IAnimeTagRepository)
    private readonly animeTagRepo: IAnimeTagRepository,
  ) {}

  public async findOrCreateAnimeTag(
    tagParam: Partial<AnimeTag>,
  ): Promise<AnimeTag> {
    const animeTag = await this.animeTagRepo.findByCondition({
      where: {
        name: tagParam.name,
        idAnilist: tagParam.idAnilist,
      },
    });

    if (animeTag) {
      return animeTag;
    }

    return await this.animeTagRepo.save(tagParam);
  }
}
