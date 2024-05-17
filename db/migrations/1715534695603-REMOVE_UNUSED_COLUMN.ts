import { MigrationInterface, QueryRunner } from "typeorm";

export class REMOVEUNUSEDCOLUMN1715534695603 implements MigrationInterface {
    name = 'REMOVEUNUSEDCOLUMN1715534695603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mediaExternalLinks" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "mediaExternalLinks" DROP COLUMN "icon"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mediaExternalLinks" ADD "icon" character varying`);
        await queryRunner.query(`ALTER TABLE "mediaExternalLinks" ADD "color" character varying`);
    }

}
