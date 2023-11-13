import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class FloatNumber1699801956065 implements MigrationInterface {
  name = 'FloatNumber1699801956065'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "drug_package" DROP COLUMN "refundRate"')
    await queryRunner.query('ALTER TABLE "drug_package" ADD "refundRate" double precision')
    await queryRunner.query('ALTER TABLE "drug_package" DROP COLUMN "price"')
    await queryRunner.query('ALTER TABLE "drug_package" ADD "price" double precision')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "drug_package" DROP COLUMN "price"')
    await queryRunner.query('ALTER TABLE "drug_package" ADD "price" integer')
    await queryRunner.query('ALTER TABLE "drug_package" DROP COLUMN "refundRate"')
    await queryRunner.query('ALTER TABLE "drug_package" ADD "refundRate" integer')
  }
}
