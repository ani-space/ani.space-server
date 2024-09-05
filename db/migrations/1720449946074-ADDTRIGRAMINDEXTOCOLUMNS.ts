import { MigrationInterface, QueryRunner } from 'typeorm';

export class ADDTRIGRAMINDEXTOCOLUMNS1720449946074
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);
    await queryRunner.query(
      `CREATE INDEX "IDX_romaji_trgm" ON "animeTitles" USING gin ("romaji" gin_trgm_ops);`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_english_trgm" ON "animeTitles" USING gin ("english" gin_trgm_ops);`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_native_trgm" ON "animeTitles" USING gin ("native" gin_trgm_ops);`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_vietnamese_trgm" ON "animeTitles" USING gin ("vietnamese" gin_trgm_ops);`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_userPreferred_trgm" ON "animeTitles" USING gin ("userPreferred" gin_trgm_ops);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_romaji_trgm";`);
    await queryRunner.query(`DROP INDEX "IDX_english_trgm";`);
    await queryRunner.query(`DROP INDEX "IDX_native_trgm";`);
    await queryRunner.query(`DROP INDEX "IDX_vietnamese_trgm";`);
    await queryRunner.query(`DROP INDEX "IDX_userPreferred_trgm";`);
  }
}
