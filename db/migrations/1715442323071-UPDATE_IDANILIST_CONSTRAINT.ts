import { MigrationInterface, QueryRunner } from "typeorm";

export class UPDATEIDANILISTCONSTRAINT1715442323071 implements MigrationInterface {
    name = 'UPDATEIDANILISTCONSTRAINT1715442323071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ac114626ed593ef907b44a4a7a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a7eed90e10f07147a33005ec8a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_072967b0dd67421d3c04f8a1d4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e64f63b15a5c37eae8138adce9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad4ef85b2cacf6c42f6a5769c8"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ad4ef85b2cacf6c42f6a5769c8" ON "animeEdges" ("idAnilist") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e64f63b15a5c37eae8138adce9" ON "airingScheduleEdges" ("idAnilist") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_072967b0dd67421d3c04f8a1d4" ON "studioEdges" ("idAnilist") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a7eed90e10f07147a33005ec8a" ON "staffEdges" ("idAnilist") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ac114626ed593ef907b44a4a7a" ON "characterEdges" ("idAnilist") `);
    }

}
