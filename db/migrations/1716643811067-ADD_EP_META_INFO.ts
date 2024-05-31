import { MigrationInterface, QueryRunner } from 'typeorm';

export class ADDEPMETAINFO1716643811067 implements MigrationInterface {
  name = 'ADDEPMETAINFO1716643811067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "animeStreamingEpisodes" ADD "epId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animeStreamingEpisodes" ADD "epHash" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "animeStreamingEpisodes" DROP COLUMN "epHash"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animeStreamingEpisodes" DROP COLUMN "epId"`,
    );
  }
}
