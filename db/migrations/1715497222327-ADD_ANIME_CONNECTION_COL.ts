import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDANIMECONNECTIONCOL1715497222327 implements MigrationInterface {
    name = 'ADDANIMECONNECTIONCOL1715497222327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studios" ADD "animeId" uuid`);
        await queryRunner.query(`ALTER TABLE "studios" ADD CONSTRAINT "UQ_f08846713f38da39c257cc38941" UNIQUE ("animeId")`);
        await queryRunner.query(`ALTER TABLE "studios" ADD CONSTRAINT "FK_f08846713f38da39c257cc38941" FOREIGN KEY ("animeId") REFERENCES "animeConnections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studios" DROP CONSTRAINT "FK_f08846713f38da39c257cc38941"`);
        await queryRunner.query(`ALTER TABLE "studios" DROP CONSTRAINT "UQ_f08846713f38da39c257cc38941"`);
        await queryRunner.query(`ALTER TABLE "studios" DROP COLUMN "animeId"`);
    }

}
