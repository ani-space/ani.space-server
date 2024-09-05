import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDUNIQUEINDEXONANIMEPATH1715607200445 implements MigrationInterface {
    name = 'ADDUNIQUEINDEXONANIMEPATH1715607200445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fdce24538a5279f3356cf60f7c" ON "mediaExternalLinks" ("animePath") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_fdce24538a5279f3356cf60f7c"`);
    }

}
