import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDSTAFFUSERPREFERREDNAMECOL1714833209396 implements MigrationInterface {
    name = 'ADDSTAFFUSERPREFERREDNAMECOL1714833209396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staffNames" ADD "userPreferred" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staffNames" DROP COLUMN "userPreferred"`);
    }

}
