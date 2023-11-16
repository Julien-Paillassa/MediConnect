import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class CreatePlanAndSubscription1700100654344 implements MigrationInterface {
  name = 'CreatePlanAndSubscription1700100654344'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "plan" ("id" character varying NOT NULL, "name" character varying(100) NOT NULL, "ratePerMonth" integer NOT NULL, CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TABLE "subscription" ("id" character varying NOT NULL, "userId" character varying NOT NULL, "planId" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))')
    await queryRunner.query('ALTER TABLE "user" ADD "subscriptionId" character varying')
    await queryRunner.query('ALTER TABLE "api_key" DROP CONSTRAINT "FK_74d2236b1de818d00bd3fd01602"')
    await queryRunner.query('ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"')
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "id"')
    await queryRunner.query('ALTER TABLE "user" ADD "id" character varying NOT NULL')
    await queryRunner.query('ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")')
    await queryRunner.query('ALTER TABLE "api_key" DROP COLUMN "ownerId"')
    await queryRunner.query('ALTER TABLE "api_key" ADD "ownerId" character varying')
    await queryRunner.query('ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "subscription" ADD CONSTRAINT "FK_6b6d0e4dc88105a4a11103dd2cd" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "user" ADD CONSTRAINT "FK_f1d3ffb910b5c1a9052df7c1833" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "api_key" ADD CONSTRAINT "FK_74d2236b1de818d00bd3fd01602" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "api_key" DROP CONSTRAINT "FK_74d2236b1de818d00bd3fd01602"')
    await queryRunner.query('ALTER TABLE "user" DROP CONSTRAINT "FK_f1d3ffb910b5c1a9052df7c1833"')
    await queryRunner.query('ALTER TABLE "subscription" DROP CONSTRAINT "FK_6b6d0e4dc88105a4a11103dd2cd"')
    await queryRunner.query('ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"')
    await queryRunner.query('ALTER TABLE "api_key" DROP COLUMN "ownerId"')
    await queryRunner.query('ALTER TABLE "api_key" ADD "ownerId" integer')
    await queryRunner.query('ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"')
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "id"')
    await queryRunner.query('ALTER TABLE "user" ADD "id" SERIAL NOT NULL')
    await queryRunner.query('ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")')
    await queryRunner.query('ALTER TABLE "api_key" ADD CONSTRAINT "FK_74d2236b1de818d00bd3fd01602" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "subscriptionId"')
    await queryRunner.query('DROP TABLE "subscription"')
    await queryRunner.query('DROP TABLE "plan"')
  }
}
