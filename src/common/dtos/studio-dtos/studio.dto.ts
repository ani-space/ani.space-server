import { AutoMap } from '@automapper/classes';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AnimeConnectionDto } from '../anime-dtos/anime-connection.dto';
import { BaseAnilistDto } from '../base-dtos/base-anilist.dto';

@ObjectType()
export class StudioDto extends BaseAnilistDto {
  @AutoMap()
  @Field()
  name: string;

  @AutoMap()
  @Field({
    description:
      'If the studio is an animation studio or a different kind of company',
  })
  isAnimationStudio: boolean;

  @AutoMap(() => AnimeConnectionDto)
  @Field((type) => AnimeConnectionDto, {
    nullable: true,
    description: 'The media the studio has worked on',
  })
  anime?: AnimeConnectionDto;

  @AutoMap()
  @Field({ nullable: true })
  siteUrl?: string;

  @AutoMap()
  @Field((type) => Int, {
    nullable: true,
    description: `The amount of user's who have favourited the studio`,
  })
  favorites?: number;
}
