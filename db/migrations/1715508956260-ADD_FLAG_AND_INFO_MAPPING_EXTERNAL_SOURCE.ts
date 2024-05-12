import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDFLAGANDINFOMAPPINGEXTERNALSOURCE1715508956260 implements MigrationInterface {
    name = 'ADDFLAGANDINFOMAPPINGEXTERNALSOURCE1715508956260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mediaExternalLinks" DROP COLUMN "siteId"`);
        await queryRunner.query(`ALTER TABLE "mediaExternalLinks" ADD "isMatching" boolean`);
        await queryRunner.query(`ALTER TABLE "mediaExternalLinks" ADD "matchingScore" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mediaExternalLinks" DROP COLUMN "matchingScore"`);
        await queryRunner.query(`ALTER TABLE "mediaExternalLinks" DROP COLUMN "isMatching"`);
        await queryRunner.query(`ALTER TABLE "mediaExternalLinks" ADD "siteId" integer`);
    }

}
