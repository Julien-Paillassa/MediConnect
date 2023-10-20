import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class GenerateApiKey1697793710826 implements MigrationInterface {
  name = 'GenerateApiKey1697793710826'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "api_key" ALTER COLUMN "key" SET DEFAULT md5(random()::text)')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "api_key" ALTER COLUMN "key" DROP DEFAULT')
  }
}
