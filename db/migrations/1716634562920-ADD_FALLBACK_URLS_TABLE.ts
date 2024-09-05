import { MigrationInterface, QueryRunner } from 'typeorm';

export class ADDFALLBACKURLSTABLE1716634562920 implements MigrationInterface {
  name = 'ADDFALLBACKURLSTABLE1716634562920';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "animeStreamingEpisodeFallBackUrls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fallbackUrl" character varying, "quality" character varying, "isM3U8" boolean NOT NULL DEFAULT false, "formatType" character varying, "animeStreamingEpisodeId" uuid, CONSTRAINT "PK_2b75b2191a89367350b8bf576b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "animeStreamingEpisodeFallBackUrls" ADD CONSTRAINT "FK_c7f93d4fa8f2a685679125c03b5" FOREIGN KEY ("animeStreamingEpisodeId") REFERENCES "animeStreamingEpisodes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "animeStreamingEpisodeFallBackUrls" DROP CONSTRAINT "FK_c7f93d4fa8f2a685679125c03b5"`,
    );
    await queryRunner.query(`DROP TABLE "animeStreamingEpisodeFallBackUrls"`);
  }
}
