import { MigrationInterface, QueryRunner } from 'typeorm';

export class ADDAUTHMODELS1721141571099 implements MigrationInterface {
  name = 'ADDAUTHMODELS1721141571099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "token" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6a8ca5961656d13c16c04079dd" ON "tokens" ("token") `,
    );
    await queryRunner.query(
      `CREATE TABLE "socialProvider" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "provider" character varying NOT NULL, "socialId" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_b79c89b0ca3c27af5629f2a84e2" UNIQUE ("socialId"), CONSTRAINT "PK_79abe96f4c501168f10f9a2315d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userName" character varying, "email" character varying NOT NULL, "password" character varying, "displayName" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_226bb9aa7aa8a69991209d58f5" ON "users" ("userName") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."animeEdges_relationtype_enum" RENAME TO "animeEdges_relationtype_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."AnimeRelation" AS ENUM('ADAPTATION', 'PREQUEL', 'SEQUEL', 'PARENT', 'SIDE_STORY', 'CHARACTER', 'SUMMARY', 'ALTERNATIVE', 'SPIN_OFF', 'OTHER', 'SOURCE', 'COMPILATION', 'CONTAINS')`,
    );
    await queryRunner.query(
      `ALTER TABLE "animeEdges" ALTER COLUMN "relationType" TYPE "public"."AnimeRelation" USING "relationType"::"text"::"public"."AnimeRelation"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."animeEdges_relationtype_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "socialProvider" ADD CONSTRAINT "FK_040a594d415c450aaf3599d3fc2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "socialProvider" DROP CONSTRAINT "FK_040a594d415c450aaf3599d3fc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."animeEdges_relationtype_enum_old" AS ENUM('ADAPTATION', 'PREQUEL', 'SEQUEL', 'PARENT', 'SIDE_STORY', 'CHARACTER', 'SUMMARY', 'ALTERNATIVE', 'SPIN_OFF', 'OTHER', 'SOURCE', 'COMPILATION', 'CONTAINS')`,
    );
    await queryRunner.query(
      `ALTER TABLE "animeEdges" ALTER COLUMN "relationType" TYPE "public"."animeEdges_relationtype_enum_old" USING "relationType"::"text"::"public"."animeEdges_relationtype_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."AnimeRelation"`);
    await queryRunner.query(
      `ALTER TYPE "public"."animeEdges_relationtype_enum_old" RENAME TO "animeEdges_relationtype_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_226bb9aa7aa8a69991209d58f5"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "socialProvider"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6a8ca5961656d13c16c04079dd"`,
    );
    await queryRunner.query(`DROP TABLE "tokens"`);
  }
}
