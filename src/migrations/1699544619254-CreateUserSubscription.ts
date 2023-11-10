import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class CreateUserSubscription1699544619254 implements MigrationInterface {
  name = 'CreateUserSubscription1699544619254'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP CONSTRAINT "FK_f1d3ffb910b5c1a9052df7c1833"')
    await queryRunner.query('CREATE TABLE "user_subscription" ("userId" integer NOT NULL, "subscriptionId" integer NOT NULL, "active" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_e843ed2446cfda0ad317b09de8f" PRIMARY KEY ("userId", "subscriptionId"))')
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "subscriptionId"')
    await queryRunner.query('ALTER TABLE "subscription" ADD "stripeSubscriptionId" character varying NOT NULL')
    await queryRunner.query('ALTER TABLE "user" ADD "subscriptionUserId" integer')
    await queryRunner.query('ALTER TABLE "user" ADD "subscriptionSubscriptionId" integer')
    await queryRunner.query('ALTER TABLE "user_subscription" ADD CONSTRAINT "FK_403d98d1638533c09f9b185929b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "user_subscription" ADD CONSTRAINT "FK_a7575d9d46b42a9d7f275be1ec4" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "user" ADD CONSTRAINT "FK_2760508c1091408ac1c11ec1fd9" FOREIGN KEY ("subscriptionUserId", "subscriptionSubscriptionId") REFERENCES "user_subscription"("userId","subscriptionId") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP CONSTRAINT "FK_2760508c1091408ac1c11ec1fd9"')
    await queryRunner.query('ALTER TABLE "user_subscription" DROP CONSTRAINT "FK_a7575d9d46b42a9d7f275be1ec4"')
    await queryRunner.query('ALTER TABLE "user_subscription" DROP CONSTRAINT "FK_403d98d1638533c09f9b185929b"')
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "subscriptionSubscriptionId"')
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "subscriptionUserId"')
    await queryRunner.query('ALTER TABLE "subscription" DROP COLUMN "stripeSubscriptionId"')
    await queryRunner.query('ALTER TABLE "user" ADD "subscriptionId" integer')
    await queryRunner.query('DROP TABLE "user_subscription"')
    await queryRunner.query('ALTER TABLE "user" ADD CONSTRAINT "FK_f1d3ffb910b5c1a9052df7c1833" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }
}
