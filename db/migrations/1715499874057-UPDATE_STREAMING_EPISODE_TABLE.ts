import { MigrationInterface, QueryRunner } from "typeorm";

export class UPDATESTREAMINGEPISODETABLE1715499874057 implements MigrationInterface {
    name = 'UPDATESTREAMINGEPISODETABLE1715499874057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" ADD "fallbackServerId" uuid`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" ADD CONSTRAINT "FK_37b0c567501d42173efa17e3ff3" FOREIGN KEY ("fallbackServerId") REFERENCES "animeStreamingEpisodes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" DROP CONSTRAINT "FK_37b0c567501d42173efa17e3ff3"`);
        await queryRunner.query(`ALTER TABLE "animeStreamingEpisodes" DROP COLUMN "fallbackServerId"`);
    }

}
