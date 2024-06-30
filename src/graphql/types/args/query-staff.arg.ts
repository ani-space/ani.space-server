import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';

@ArgsType()
@ObjectType()
export class QueryStaffArg {
  @Field(() => Int)
  idAnilist: number;

  @Field({ nullable: true })
  id?: string;

  @Field({
    nullable: true,
    description: `Last name, first name, middle name, full name, and native name will be searched.`,
  })
  name?: string;
}
