import { MigrationInterface, QueryRunner } from "typeorm";

export class EDITREALTIONSHIPNODETYPE1714924837615 implements MigrationInterface {
    name = 'EDITREALTIONSHIPNODETYPE1714924837615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animeEdges" DROP CONSTRAINT "FK_63e3b515675c9db42a3533a9a15"`);
        await queryRunner.query(`ALTER TABLE "animeEdges" DROP CONSTRAINT "REL_63e3b515675c9db42a3533a9a1"`);
        await queryRunner.query(`ALTER TABLE "animeEdges" ADD CONSTRAINT "FK_63e3b515675c9db42a3533a9a15" FOREIGN KEY ("nodeId") REFERENCES "anime"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animeEdges" DROP CONSTRAINT "FK_63e3b515675c9db42a3533a9a15"`);
        await queryRunner.query(`ALTER TABLE "animeEdges" ADD CONSTRAINT "REL_63e3b515675c9db42a3533a9a1" UNIQUE ("nodeId")`);
        await queryRunner.query(`ALTER TABLE "animeEdges" ADD CONSTRAINT "FK_63e3b515675c9db42a3533a9a15" FOREIGN KEY ("nodeId") REFERENCES "anime"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
