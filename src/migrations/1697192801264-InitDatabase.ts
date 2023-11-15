import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class InitDatabase1697192801264 implements MigrationInterface {
  name = 'InitDatabase1697192801264'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "api_key" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "name" character varying(100) NOT NULL, "ownerId" integer, CONSTRAINT "UQ_fb080786c16de6ace7ed0b69f7d" UNIQUE ("key"), CONSTRAINT "PK_b1bd840641b8acbaad89c3d8d11" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))')
    await queryRunner.query('ALTER TABLE "api_key" ADD CONSTRAINT "FK_74d2236b1de818d00bd3fd01602" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP CONSTRAINT "FK_f1d3ffb910b5c1a9052df7c1833"')
    await queryRunner.query('ALTER TABLE "api_key" DROP CONSTRAINT "FK_74d2236b1de818d00bd3fd01602"')
    await queryRunner.query('DROP TABLE "user"')
    await queryRunner.query('DROP TABLE "api_key"')
  }
}
