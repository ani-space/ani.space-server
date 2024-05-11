import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDCHARACTERSANIMECONNECTIONCOLUMN1715414607649 implements MigrationInterface {
    name = 'ADDCHARACTERSANIMECONNECTIONCOLUMN1715414607649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characters" ADD "animeId" uuid`);
        await queryRunner.query(`ALTER TABLE "characters" ADD CONSTRAINT "UQ_be35d91862578090794eb230ef7" UNIQUE ("animeId")`);
        await queryRunner.query(`ALTER TABLE "characters" ADD CONSTRAINT "FK_be35d91862578090794eb230ef7" FOREIGN KEY ("animeId") REFERENCES "animeConnections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characters" DROP CONSTRAINT "FK_be35d91862578090794eb230ef7"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP CONSTRAINT "UQ_be35d91862578090794eb230ef7"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "animeId"`);
    }

}
