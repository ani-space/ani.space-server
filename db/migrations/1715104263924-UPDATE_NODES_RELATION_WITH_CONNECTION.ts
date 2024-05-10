import { MigrationInterface, QueryRunner } from "typeorm";

export class UPDATENODESRELATIONWITHCONNECTION1715104263924 implements MigrationInterface {
    name = 'UPDATENODESRELATIONWITHCONNECTION1715104263924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "airingSchedules" DROP CONSTRAINT "FK_9a66e87e84d293e4e2cd5f4a61b"`);
        await queryRunner.query(`ALTER TABLE "animeTrends" DROP CONSTRAINT "FK_89e5245e98874e83d628b00da47"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP CONSTRAINT "FK_431435bea921157c2dfb887faa6"`);
        await queryRunner.query(`ALTER TABLE "staffs" DROP CONSTRAINT "FK_1174f1795cb7d96e2c1babb57f0"`);
        await queryRunner.query(`ALTER TABLE "studios" DROP CONSTRAINT "FK_bdfe2ec2a3a1b7cc35428cd351c"`);
        await queryRunner.query(`CREATE TABLE "anime_trend_connections_nodes_anime_trends" ("animeTrendConnectionsId" uuid NOT NULL, "animeTrendsId" uuid NOT NULL, CONSTRAINT "PK_c5ff7fde71e83635e31df949ccf" PRIMARY KEY ("animeTrendConnectionsId", "animeTrendsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ee00cae6c8610b437d1787a50b" ON "anime_trend_connections_nodes_anime_trends" ("animeTrendConnectionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ae6b0656aa56b8019c83615313" ON "anime_trend_connections_nodes_anime_trends" ("animeTrendsId") `);
        await queryRunner.query(`CREATE TABLE "character_connections_nodes_characters" ("characterConnectionsId" uuid NOT NULL, "charactersId" uuid NOT NULL, CONSTRAINT "PK_7738946dd3c2b1c49e042add1f1" PRIMARY KEY ("characterConnectionsId", "charactersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3487809f066c0ecfe89eeb3115" ON "character_connections_nodes_characters" ("characterConnectionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_675d46965a2f940d9643b15d7d" ON "character_connections_nodes_characters" ("charactersId") `);
        await queryRunner.query(`CREATE TABLE "staff_connections_nodes_staffs" ("staffConnectionsId" uuid NOT NULL, "staffsId" uuid NOT NULL, CONSTRAINT "PK_99d054139610717e853b12a36dc" PRIMARY KEY ("staffConnectionsId", "staffsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f794e8c4789cb9cae23ff53f87" ON "staff_connections_nodes_staffs" ("staffConnectionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4964372789ccf7cf4bf2fd95e4" ON "staff_connections_nodes_staffs" ("staffsId") `);
        await queryRunner.query(`CREATE TABLE "studio_connections_nodes_studios" ("studioConnectionsId" uuid NOT NULL, "studiosId" uuid NOT NULL, CONSTRAINT "PK_b06ac98465d7d7c5b8b0ebac464" PRIMARY KEY ("studioConnectionsId", "studiosId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fce2fb066103bcff86cee57b0f" ON "studio_connections_nodes_studios" ("studioConnectionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d16daabe4c2ff559726e8212be" ON "studio_connections_nodes_studios" ("studiosId") `);
        await queryRunner.query(`CREATE TABLE "airing_schedule_connections_nodes_airing_schedules" ("airingScheduleConnectionsId" uuid NOT NULL, "airingSchedulesId" uuid NOT NULL, CONSTRAINT "PK_aca6dde0f577faf97bc21efd434" PRIMARY KEY ("airingScheduleConnectionsId", "airingSchedulesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6c598ba0b5b89b1978308dfcbc" ON "airing_schedule_connections_nodes_airing_schedules" ("airingScheduleConnectionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1c3697584a6cbb98cf63d3dea1" ON "airing_schedule_connections_nodes_airing_schedules" ("airingSchedulesId") `);
        await queryRunner.query(`ALTER TABLE "airingSchedules" DROP COLUMN "airingScheduleConnectionId"`);
        await queryRunner.query(`ALTER TABLE "animeTrends" DROP COLUMN "animeTrendConnectionId"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "characterConnectionId"`);
        await queryRunner.query(`ALTER TABLE "staffs" DROP COLUMN "staffConnectionId"`);
        await queryRunner.query(`ALTER TABLE "studios" DROP COLUMN "studioConnectionId"`);
        await queryRunner.query(`ALTER TABLE "anime_trend_connections_nodes_anime_trends" ADD CONSTRAINT "FK_ee00cae6c8610b437d1787a50b4" FOREIGN KEY ("animeTrendConnectionsId") REFERENCES "animeTrendConnections"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "anime_trend_connections_nodes_anime_trends" ADD CONSTRAINT "FK_ae6b0656aa56b8019c836153133" FOREIGN KEY ("animeTrendsId") REFERENCES "animeTrends"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "character_connections_nodes_characters" ADD CONSTRAINT "FK_3487809f066c0ecfe89eeb3115d" FOREIGN KEY ("characterConnectionsId") REFERENCES "characterConnections"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "character_connections_nodes_characters" ADD CONSTRAINT "FK_675d46965a2f940d9643b15d7d9" FOREIGN KEY ("charactersId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "staff_connections_nodes_staffs" ADD CONSTRAINT "FK_f794e8c4789cb9cae23ff53f879" FOREIGN KEY ("staffConnectionsId") REFERENCES "staffConnections"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "staff_connections_nodes_staffs" ADD CONSTRAINT "FK_4964372789ccf7cf4bf2fd95e43" FOREIGN KEY ("staffsId") REFERENCES "staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "studio_connections_nodes_studios" ADD CONSTRAINT "FK_fce2fb066103bcff86cee57b0f9" FOREIGN KEY ("studioConnectionsId") REFERENCES "studioConnections"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "studio_connections_nodes_studios" ADD CONSTRAINT "FK_d16daabe4c2ff559726e8212be5" FOREIGN KEY ("studiosId") REFERENCES "studios"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "airing_schedule_connections_nodes_airing_schedules" ADD CONSTRAINT "FK_6c598ba0b5b89b1978308dfcbca" FOREIGN KEY ("airingScheduleConnectionsId") REFERENCES "airingScheduleConnections"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "airing_schedule_connections_nodes_airing_schedules" ADD CONSTRAINT "FK_1c3697584a6cbb98cf63d3dea19" FOREIGN KEY ("airingSchedulesId") REFERENCES "airingSchedules"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "airing_schedule_connections_nodes_airing_schedules" DROP CONSTRAINT "FK_1c3697584a6cbb98cf63d3dea19"`);
        await queryRunner.query(`ALTER TABLE "airing_schedule_connections_nodes_airing_schedules" DROP CONSTRAINT "FK_6c598ba0b5b89b1978308dfcbca"`);
        await queryRunner.query(`ALTER TABLE "studio_connections_nodes_studios" DROP CONSTRAINT "FK_d16daabe4c2ff559726e8212be5"`);
        await queryRunner.query(`ALTER TABLE "studio_connections_nodes_studios" DROP CONSTRAINT "FK_fce2fb066103bcff86cee57b0f9"`);
        await queryRunner.query(`ALTER TABLE "staff_connections_nodes_staffs" DROP CONSTRAINT "FK_4964372789ccf7cf4bf2fd95e43"`);
        await queryRunner.query(`ALTER TABLE "staff_connections_nodes_staffs" DROP CONSTRAINT "FK_f794e8c4789cb9cae23ff53f879"`);
        await queryRunner.query(`ALTER TABLE "character_connections_nodes_characters" DROP CONSTRAINT "FK_675d46965a2f940d9643b15d7d9"`);
        await queryRunner.query(`ALTER TABLE "character_connections_nodes_characters" DROP CONSTRAINT "FK_3487809f066c0ecfe89eeb3115d"`);
        await queryRunner.query(`ALTER TABLE "anime_trend_connections_nodes_anime_trends" DROP CONSTRAINT "FK_ae6b0656aa56b8019c836153133"`);
        await queryRunner.query(`ALTER TABLE "anime_trend_connections_nodes_anime_trends" DROP CONSTRAINT "FK_ee00cae6c8610b437d1787a50b4"`);
        await queryRunner.query(`ALTER TABLE "studios" ADD "studioConnectionId" uuid`);
        await queryRunner.query(`ALTER TABLE "staffs" ADD "staffConnectionId" uuid`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "characterConnectionId" uuid`);
        await queryRunner.query(`ALTER TABLE "animeTrends" ADD "animeTrendConnectionId" uuid`);
        await queryRunner.query(`ALTER TABLE "airingSchedules" ADD "airingScheduleConnectionId" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c3697584a6cbb98cf63d3dea1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6c598ba0b5b89b1978308dfcbc"`);
        await queryRunner.query(`DROP TABLE "airing_schedule_connections_nodes_airing_schedules"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d16daabe4c2ff559726e8212be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fce2fb066103bcff86cee57b0f"`);
        await queryRunner.query(`DROP TABLE "studio_connections_nodes_studios"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4964372789ccf7cf4bf2fd95e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f794e8c4789cb9cae23ff53f87"`);
        await queryRunner.query(`DROP TABLE "staff_connections_nodes_staffs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_675d46965a2f940d9643b15d7d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3487809f066c0ecfe89eeb3115"`);
        await queryRunner.query(`DROP TABLE "character_connections_nodes_characters"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ae6b0656aa56b8019c83615313"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee00cae6c8610b437d1787a50b"`);
        await queryRunner.query(`DROP TABLE "anime_trend_connections_nodes_anime_trends"`);
        await queryRunner.query(`ALTER TABLE "studios" ADD CONSTRAINT "FK_bdfe2ec2a3a1b7cc35428cd351c" FOREIGN KEY ("studioConnectionId") REFERENCES "studioConnections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staffs" ADD CONSTRAINT "FK_1174f1795cb7d96e2c1babb57f0" FOREIGN KEY ("staffConnectionId") REFERENCES "staffConnections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "characters" ADD CONSTRAINT "FK_431435bea921157c2dfb887faa6" FOREIGN KEY ("characterConnectionId") REFERENCES "characterConnections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "animeTrends" ADD CONSTRAINT "FK_89e5245e98874e83d628b00da47" FOREIGN KEY ("animeTrendConnectionId") REFERENCES "animeTrendConnections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "airingSchedules" ADD CONSTRAINT "FK_9a66e87e84d293e4e2cd5f4a61b" FOREIGN KEY ("airingScheduleConnectionId") REFERENCES "airingScheduleConnections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
