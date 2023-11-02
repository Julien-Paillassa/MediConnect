import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class ApiKeyCreationExpirationDate1698580190376 implements MigrationInterface {
  name = 'ApiKeyCreationExpirationDate1698580190376'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "api_key" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()')
    await queryRunner.query('ALTER TABLE "api_key" ADD "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL')
    await queryRunner.query('ALTER TABLE "api_key" ALTER COLUMN "key" SET DEFAULT md5(random()::text)')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "api_key" ALTER COLUMN "key" SET DEFAULT md5((random()))')
    await queryRunner.query('ALTER TABLE "api_key" DROP COLUMN "expiresAt"')
    await queryRunner.query('ALTER TABLE "api_key" DROP COLUMN "createdAt"')
  }
}
