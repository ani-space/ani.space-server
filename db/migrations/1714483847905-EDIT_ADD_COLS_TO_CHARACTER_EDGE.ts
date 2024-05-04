import { MigrationInterface, QueryRunner } from "typeorm";

export class EDITADDCOLSTOCHARACTEREDGE1714483847905 implements MigrationInterface {
    name = 'EDITADDCOLSTOCHARACTEREDGE1714483847905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "character_edges_voice_actors_staffs" ("characterEdgesId" uuid NOT NULL, "staffsId" uuid NOT NULL, CONSTRAINT "PK_d078613ed3d93908bc08881e26c" PRIMARY KEY ("characterEdgesId", "staffsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1ba70f7635e82a39f0f6df2d52" ON "character_edges_voice_actors_staffs" ("characterEdgesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8155d8af6fcbcd03d704839654" ON "character_edges_voice_actors_staffs" ("staffsId") `);
        await queryRunner.query(`ALTER TABLE "staffRoleTypes" ADD "characterEdgeId" uuid`);
        await queryRunner.query(`ALTER TABLE "staffRoleTypes" ADD CONSTRAINT "FK_f53c02e98d779da69f3ebc7d8aa" FOREIGN KEY ("characterEdgeId") REFERENCES "characterEdges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "character_edges_voice_actors_staffs" ADD CONSTRAINT "FK_1ba70f7635e82a39f0f6df2d527" FOREIGN KEY ("characterEdgesId") REFERENCES "characterEdges"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "character_edges_voice_actors_staffs" ADD CONSTRAINT "FK_8155d8af6fcbcd03d7048396549" FOREIGN KEY ("staffsId") REFERENCES "staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "character_edges_voice_actors_staffs" DROP CONSTRAINT "FK_8155d8af6fcbcd03d7048396549"`);
        await queryRunner.query(`ALTER TABLE "character_edges_voice_actors_staffs" DROP CONSTRAINT "FK_1ba70f7635e82a39f0f6df2d527"`);
        await queryRunner.query(`ALTER TABLE "staffRoleTypes" DROP CONSTRAINT "FK_f53c02e98d779da69f3ebc7d8aa"`);
        await queryRunner.query(`ALTER TABLE "staffRoleTypes" DROP COLUMN "characterEdgeId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8155d8af6fcbcd03d704839654"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1ba70f7635e82a39f0f6df2d52"`);
        await queryRunner.query(`DROP TABLE "character_edges_voice_actors_staffs"`);
    }

}
