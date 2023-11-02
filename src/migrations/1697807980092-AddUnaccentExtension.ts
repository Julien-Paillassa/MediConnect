import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AddUnaccentExtension1697807980092 implements MigrationInterface {
  name = 'AddUnaccentExtension1697807980092'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS unaccent')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP EXTENSION IF EXISTS unaccent')
  }
}
