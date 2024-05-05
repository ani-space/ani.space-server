import { MigrationInterface, QueryRunner } from "typeorm";

export class EDITRELATIONSHIPSNODECOLUMN1714930903774 implements MigrationInterface {
    name = 'EDITRELATIONSHIPSNODECOLUMN1714930903774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "airingScheduleEdges" DROP CONSTRAINT "FK_428b3a1db4a2d7f540e74d287a3"`);
        await queryRunner.query(`ALTER TABLE "airingScheduleEdges" DROP CONSTRAINT "REL_428b3a1db4a2d7f540e74d287a"`);
        await queryRunner.query(`ALTER TABLE "animeTrendEdges" DROP CONSTRAINT "FK_be6efd17993fc49a33cbca09c4d"`);
        await queryRunner.query(`ALTER TABLE "animeTrendEdges" DROP CONSTRAINT "REL_be6efd17993fc49a33cbca09c4"`);
        await queryRunner.query(`ALTER TABLE "staffEdges" DROP CONSTRAINT "FK_78531a468e674565af82f1aa715"`);
        await queryRunner.query(`ALTER TABLE "staffEdges" DROP CONSTRAINT "REL_78531a468e674565af82f1aa71"`);
        await queryRunner.query(`ALTER TABLE "characterEdges" DROP CONSTRAINT "FK_71ba3ba89ef4efdeb47c2a7d1db"`);
        await queryRunner.query(`ALTER TABLE "characterEdges" DROP CONSTRAINT "REL_71ba3ba89ef4efdeb47c2a7d1d"`);
        await queryRunner.query(`ALTER TABLE "studioEdges" DROP CONSTRAINT "FK_587b61d2d084c8e936af309dee7"`);
        await queryRunner.query(`ALTER TABLE "studioEdges" DROP CONSTRAINT "REL_587b61d2d084c8e936af309dee"`);
        await queryRunner.query(`ALTER TABLE "airingScheduleEdges" ADD CONSTRAINT "FK_428b3a1db4a2d7f540e74d287a3" FOREIGN KEY ("nodeId") REFERENCES "airingSchedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "animeTrendEdges" ADD CONSTRAINT "FK_be6efd17993fc49a33cbca09c4d" FOREIGN KEY ("nodeId") REFERENCES "animeTrends"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staffEdges" ADD CONSTRAINT "FK_78531a468e674565af82f1aa715" FOREIGN KEY ("nodeId") REFERENCES "staffs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "characterEdges" ADD CONSTRAINT "FK_71ba3ba89ef4efdeb47c2a7d1db" FOREIGN KEY ("nodeId") REFERENCES "characters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "studioEdges" ADD CONSTRAINT "FK_587b61d2d084c8e936af309dee7" FOREIGN KEY ("nodeId") REFERENCES "studios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studioEdges" DROP CONSTRAINT "FK_587b61d2d084c8e936af309dee7"`);
        await queryRunner.query(`ALTER TABLE "characterEdges" DROP CONSTRAINT "FK_71ba3ba89ef4efdeb47c2a7d1db"`);
        await queryRunner.query(`ALTER TABLE "staffEdges" DROP CONSTRAINT "FK_78531a468e674565af82f1aa715"`);
        await queryRunner.query(`ALTER TABLE "animeTrendEdges" DROP CONSTRAINT "FK_be6efd17993fc49a33cbca09c4d"`);
        await queryRunner.query(`ALTER TABLE "airingScheduleEdges" DROP CONSTRAINT "FK_428b3a1db4a2d7f540e74d287a3"`);
        await queryRunner.query(`ALTER TABLE "studioEdges" ADD CONSTRAINT "REL_587b61d2d084c8e936af309dee" UNIQUE ("nodeId")`);
        await queryRunner.query(`ALTER TABLE "studioEdges" ADD CONSTRAINT "FK_587b61d2d084c8e936af309dee7" FOREIGN KEY ("nodeId") REFERENCES "studios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "characterEdges" ADD CONSTRAINT "REL_71ba3ba89ef4efdeb47c2a7d1d" UNIQUE ("nodeId")`);
        await queryRunner.query(`ALTER TABLE "characterEdges" ADD CONSTRAINT "FK_71ba3ba89ef4efdeb47c2a7d1db" FOREIGN KEY ("nodeId") REFERENCES "characters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staffEdges" ADD CONSTRAINT "REL_78531a468e674565af82f1aa71" UNIQUE ("nodeId")`);
        await queryRunner.query(`ALTER TABLE "staffEdges" ADD CONSTRAINT "FK_78531a468e674565af82f1aa715" FOREIGN KEY ("nodeId") REFERENCES "staffs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "animeTrendEdges" ADD CONSTRAINT "REL_be6efd17993fc49a33cbca09c4" UNIQUE ("nodeId")`);
        await queryRunner.query(`ALTER TABLE "animeTrendEdges" ADD CONSTRAINT "FK_be6efd17993fc49a33cbca09c4d" FOREIGN KEY ("nodeId") REFERENCES "animeTrends"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "airingScheduleEdges" ADD CONSTRAINT "REL_428b3a1db4a2d7f540e74d287a" UNIQUE ("nodeId")`);
        await queryRunner.query(`ALTER TABLE "airingScheduleEdges" ADD CONSTRAINT "FK_428b3a1db4a2d7f540e74d287a3" FOREIGN KEY ("nodeId") REFERENCES "airingSchedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
