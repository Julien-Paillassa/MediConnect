import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class HandleDatesAndRenaming1698006444257 implements MigrationInterface {
  name = 'HandleDatesAndRenaming1698006444257'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "drug_specification" DROP COLUMN "deliveries"')
    await queryRunner.query('ALTER TABLE "drug_specification" ADD "administrations" text NOT NULL')
    await queryRunner.query('ALTER TABLE "drug_package" DROP COLUMN "marketingAuthorizationDeclarationDate"')
    await queryRunner.query('ALTER TABLE "drug_package" ADD "marketingAuthorizationDeclarationDate" TIMESTAMP WITH TIME ZONE NOT NULL')
    await queryRunner.query('ALTER TABLE "drug_specification" DROP COLUMN "marketingAuthorizationDate"')
    await queryRunner.query('ALTER TABLE "drug_specification" ADD "marketingAuthorizationDate" TIMESTAMP WITH TIME ZONE NOT NULL')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "drug_specification" DROP COLUMN "marketingAuthorizationDate"')
    await queryRunner.query('ALTER TABLE "drug_specification" ADD "marketingAuthorizationDate" character varying NOT NULL')
    await queryRunner.query('ALTER TABLE "drug_package" DROP COLUMN "marketingAuthorizationDeclarationDate"')
    await queryRunner.query('ALTER TABLE "drug_package" ADD "marketingAuthorizationDeclarationDate" character varying NOT NULL')
    await queryRunner.query('ALTER TABLE "drug_specification" DROP COLUMN "administrations"')
    await queryRunner.query('ALTER TABLE "drug_specification" ADD "deliveries" text NOT NULL')
  }
}
