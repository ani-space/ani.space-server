import { MigrationInterface, QueryRunner } from 'typeorm';

export class ADDUSERROLES1721926491267 implements MigrationInterface {
  name = 'ADDUSERROLES1721926491267';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "roles" text array NOT NULL DEFAULT '{user}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
  }
}
