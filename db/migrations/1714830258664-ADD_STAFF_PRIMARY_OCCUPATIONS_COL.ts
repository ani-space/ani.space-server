import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDSTAFFPRIMARYOCCUPATIONSCOL1714830258664 implements MigrationInterface {
    name = 'ADDSTAFFPRIMARYOCCUPATIONSCOL1714830258664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "staffPrimaryOccupations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "occupation" character varying, "staffId" uuid, CONSTRAINT "PK_2cef28f56e6554981f21307530f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "staffPrimaryOccupations" ADD CONSTRAINT "FK_a213699093352a8998492c07d3e" FOREIGN KEY ("staffId") REFERENCES "staffs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staffPrimaryOccupations" DROP CONSTRAINT "FK_a213699093352a8998492c07d3e"`);
        await queryRunner.query(`DROP TABLE "staffPrimaryOccupations"`);
    }

}
