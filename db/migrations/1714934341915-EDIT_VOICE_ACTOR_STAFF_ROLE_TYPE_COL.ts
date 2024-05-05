import { MigrationInterface, QueryRunner } from "typeorm";

export class EDITVOICEACTORSTAFFROLETYPECOL1714934341915 implements MigrationInterface {
    name = 'EDITVOICEACTORSTAFFROLETYPECOL1714934341915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staffRoleTypes" DROP CONSTRAINT "FK_f9c4eac13608dd9f2eef4265dd7"`);
        await queryRunner.query(`ALTER TABLE "staffRoleTypes" DROP CONSTRAINT "REL_f9c4eac13608dd9f2eef4265dd"`);
        await queryRunner.query(`ALTER TABLE "staffRoleTypes" ADD CONSTRAINT "FK_f9c4eac13608dd9f2eef4265dd7" FOREIGN KEY ("voiceActorId") REFERENCES "staffs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staffRoleTypes" DROP CONSTRAINT "FK_f9c4eac13608dd9f2eef4265dd7"`);
        await queryRunner.query(`ALTER TABLE "staffRoleTypes" ADD CONSTRAINT "REL_f9c4eac13608dd9f2eef4265dd" UNIQUE ("voiceActorId")`);
        await queryRunner.query(`ALTER TABLE "staffRoleTypes" ADD CONSTRAINT "FK_f9c4eac13608dd9f2eef4265dd7" FOREIGN KEY ("voiceActorId") REFERENCES "staffs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
