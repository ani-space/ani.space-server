import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDDETAILSINFOVIDEOSOURCE1715507651119 implements MigrationInterface {
    name = 'ADDDETAILSINFOVIDEOSOURCE1715507651119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" ADD "quality" character varying`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" ADD "isM3U8" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" ADD "formatType" character varying`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" ADD "serverName" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."animeStreamingEpisodes_servertype_enum" AS ENUM('PRIMARY', 'FALLBACK')`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" ADD "serverType" "public"."animeStreamingEpisodes_servertype_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" DROP COLUMN "serverType"`);
        await queryRunner.query(`DROP TYPE "public"."animeStreamingEpisodes_servertype_enum"`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" DROP COLUMN "serverName"`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" DROP COLUMN "formatType"`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" DROP COLUMN "isM3U8"`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" DROP COLUMN "quality"`);
    }

}
