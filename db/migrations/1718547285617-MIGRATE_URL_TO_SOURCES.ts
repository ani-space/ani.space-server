import { MigrationInterface, QueryRunner } from "typeorm";

export class MIGRATEURLTOSOURCES1718547285617 implements MigrationInterface {
    name = 'MIGRATEURLTOSOURCES1718547285617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "animeStreamingEpisodeSource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "url" character varying, "quality" character varying, "isM3U8" boolean NOT NULL DEFAULT false, "animeStreamingEpisodeId" uuid, CONSTRAINT "PK_4f358aa336df6ca844884c7e385" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" ADD "referer" character varying`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" ADD "download" character varying`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodeSource" ADD CONSTRAINT "FK_4c4e8804a92688c2fcc1ea44dd0" FOREIGN KEY ("animeStreamingEpisodeId") REFERENCES "animeStreamingEpisodes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodeSource" DROP CONSTRAINT "FK_4c4e8804a92688c2fcc1ea44dd0"`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" DROP COLUMN "download"`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" DROP COLUMN "referer"`);
        await queryRunner.query(`DROP TABLE "animeStreamingEpisodeSource"`);
    }

}
