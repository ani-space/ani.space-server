import { MigrationInterface, QueryRunner } from 'typeorm';

export class ADDGININDEXFORSYNONYM1720877770589 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_synonym_trgm" ON "animeSynonyms" USING gin ("synonym" gin_trgm_ops);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_synonym_trgm";`);
  }
}
