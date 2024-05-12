import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDANIMEPATHCOLUMN1715525754808 implements MigrationInterface {
    name = 'ADDANIMEPATHCOLUMN1715525754808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mediaExternalLinks" ADD "animePath" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mediaExternalLinks" DROP COLUMN "animePath"`);
    }

}
