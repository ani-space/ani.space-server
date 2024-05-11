import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDSTAFFANIMECOLUMN1715440098627 implements MigrationInterface {
    name = 'ADDSTAFFANIMECOLUMN1715440098627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staffs" ADD "staffAnimeId" uuid`);
        await queryRunner.query(`ALTER TABLE "staffs" ADD CONSTRAINT "UQ_f89fd0767c99cf7dbcc8503cf89" UNIQUE ("staffAnimeId")`);
        await queryRunner.query(`ALTER TABLE "staffs" ADD CONSTRAINT "FK_f89fd0767c99cf7dbcc8503cf89" FOREIGN KEY ("staffAnimeId") REFERENCES "animeConnections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staffs" DROP CONSTRAINT "FK_f89fd0767c99cf7dbcc8503cf89"`);
        await queryRunner.query(`ALTER TABLE "staffs" DROP CONSTRAINT "UQ_f89fd0767c99cf7dbcc8503cf89"`);
        await queryRunner.query(`ALTER TABLE "staffs" DROP COLUMN "staffAnimeId"`);
    }

}
