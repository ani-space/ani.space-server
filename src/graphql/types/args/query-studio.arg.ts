import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';

@ArgsType()
@ObjectType()
export class QueryStudioArg {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  isAnimationStudio?: boolean;

  @Field(() => Int)
  idAnilist: number;
}
