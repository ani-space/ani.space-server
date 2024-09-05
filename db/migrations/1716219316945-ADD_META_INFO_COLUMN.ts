import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDMETAINFOCOLUMN1716219316945 implements MigrationInterface {
    name = 'ADDMETAINFOCOLUMN1716219316945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mediaExternalLinks" ADD "metaInfo" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mediaExternalLinks" DROP COLUMN "metaInfo"`);
    }

}
