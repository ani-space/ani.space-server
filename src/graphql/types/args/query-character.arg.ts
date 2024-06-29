import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';

@ArgsType()
@ObjectType()
export class QueryCharacterArg {
  @Field({ nullable: true })
  id?: string;

  @Field(() => Int)
  idAnilist: number;

  @Field({ nullable: true })
  gender?: string;

  @Field(() => Int, { nullable: true })
  age?: number;

  @Field({ nullable: true })
  fullName?: string;
}
