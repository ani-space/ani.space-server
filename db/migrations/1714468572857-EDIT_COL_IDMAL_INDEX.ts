import { MigrationInterface, QueryRunner } from "typeorm";

export class EDITCOLIDMALINDEX1714468572857 implements MigrationInterface {
    name = 'EDITCOLIDMALINDEX1714468572857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_2a46b90863889947842d87cd72"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2a46b90863889947842d87cd72" ON "anime" ("idMal") `);
    }

}
