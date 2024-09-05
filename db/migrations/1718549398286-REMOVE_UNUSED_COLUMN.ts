import { MigrationInterface, QueryRunner } from "typeorm";

export class REMOVEUNUSEDCOLUMN1718549398286 implements MigrationInterface {
    name = 'REMOVEUNUSEDCOLUMN1718549398286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" DROP COLUMN "isM3U8"`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" DROP COLUMN "quality"`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" DROP COLUMN "url"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" ADD "url" character varying`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" ADD "quality" character varying`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" ADD "isM3U8" boolean NOT NULL DEFAULT false`);
    }

}
