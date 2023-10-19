import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class FixSubscriptionAddEmailOnUser1697704354572 implements MigrationInterface {
  name = 'FixSubscriptionAddEmailOnUser1697704354572'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "subscription" DROP COLUMN "duration"')
    await queryRunner.query('ALTER TABLE "subscription" ADD "name" character varying(100) NOT NULL')
    await queryRunner.query('ALTER TABLE "subscription" ADD "ratePerMonth" integer NOT NULL')
    await queryRunner.query('ALTER TABLE "subscription" ADD "overageFeePerRequest" integer NOT NULL')
    await queryRunner.query('ALTER TABLE "user" ADD "email" character varying(100) NOT NULL')
    await queryRunner.query('ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")')
    await queryRunner.query('ALTER TABLE "api_key" DROP CONSTRAINT "UQ_fb080786c16de6ace7ed0b69f7d"')
    await queryRunner.query('ALTER TABLE "api_key" DROP COLUMN "key"')
    await queryRunner.query('ALTER TABLE "api_key" ADD "key" character(32) NOT NULL')
    await queryRunner.query('ALTER TABLE "api_key" ADD CONSTRAINT "UQ_fb080786c16de6ace7ed0b69f7d" UNIQUE ("key")')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "api_key" DROP CONSTRAINT "UQ_fb080786c16de6ace7ed0b69f7d"')
    await queryRunner.query('ALTER TABLE "api_key" DROP COLUMN "key"')
    await queryRunner.query('ALTER TABLE "api_key" ADD "key" character varying NOT NULL')
    await queryRunner.query('ALTER TABLE "api_key" ADD CONSTRAINT "UQ_fb080786c16de6ace7ed0b69f7d" UNIQUE ("key")')
    await queryRunner.query('ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"')
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "email"')
    await queryRunner.query('ALTER TABLE "subscription" DROP COLUMN "overageFeePerRequest"')
    await queryRunner.query('ALTER TABLE "subscription" DROP COLUMN "ratePerMonth"')
    await queryRunner.query('ALTER TABLE "subscription" DROP COLUMN "name"')
    await queryRunner.query('ALTER TABLE "subscription" ADD "duration" integer NOT NULL')
  }
}
