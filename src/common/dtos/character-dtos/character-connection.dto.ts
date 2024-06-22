import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';
import { CharacterEdgeDto } from './character-edge.dto';
import { CharacterDto } from './character.dto';
import { PageInfo } from '../../../models/base-models/page-info.model';

@ObjectType()
export class CharacterConnectionDto extends BaseDto {
  @AutoMap(() => [CharacterEdgeDto])
  @Field((type) => [CharacterEdgeDto], { nullable: true })
  edges: CharacterEdgeDto[];

  @AutoMap(() => [CharacterDto])
  @Field((type) => [CharacterDto], { nullable: true })
  nodes: CharacterDto[];

  @Field((type) => PageInfo)
  pageInfo: PageInfo;
}
