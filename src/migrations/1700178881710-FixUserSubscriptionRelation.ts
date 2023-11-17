import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class FixUserSubscriptionRelation1700178881710 implements MigrationInterface {
  name = 'FixUserSubscriptionRelation1700178881710'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP CONSTRAINT "FK_f1d3ffb910b5c1a9052df7c1833"')
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "subscriptionId"')
    await queryRunner.query('ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"')
    await queryRunner.query('ALTER TABLE "subscription" ADD CONSTRAINT "UQ_cc906b4bc892b048f1b654d2aa0" UNIQUE ("userId")')
    await queryRunner.query('ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"')
    await queryRunner.query('ALTER TABLE "subscription" DROP CONSTRAINT "UQ_cc906b4bc892b048f1b654d2aa0"')
    await queryRunner.query('ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "user" ADD "subscriptionId" character varying')
    await queryRunner.query('ALTER TABLE "user" ADD CONSTRAINT "FK_f1d3ffb910b5c1a9052df7c1833" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }
}
