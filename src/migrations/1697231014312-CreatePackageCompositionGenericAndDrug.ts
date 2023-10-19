import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class CreatePackageCompositionGenericAndDrug1697231014312 implements MigrationInterface {
  name = 'CreatePackageCompositionGenericAndDrug1697231014312'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE "public"."drug_package_status_enum" AS ENUM(\'Présentation active\', \'Présentation abrogée\')')
    await queryRunner.query('CREATE TYPE "public"."drug_package_marketingauthorizationstatus_enum" AS ENUM(\'Déclaration de commercialisation\', \'Déclaration de suspension de commercialisation\', \'Arrêt de commercialisation déclaré\', \'Arrêt de commercialisation pour autorisation retirée\')')
    await queryRunner.query('CREATE TABLE "drug_package" ("id" integer NOT NULL, "longId" bigint NOT NULL, "name" character varying NOT NULL, "status" "public"."drug_package_status_enum" NOT NULL, "marketingAuthorizationStatus" "public"."drug_package_marketingauthorizationstatus_enum" NOT NULL, "marketingAuthorizationDeclarationDate" character varying NOT NULL, "isAgreedToCommunities" boolean NOT NULL, "refundRate" integer, "price" integer, "refundInformation" character varying, "drugId" integer, CONSTRAINT "PK_95f2ebdb17f5a19d6c0556eca2c" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TYPE "public"."drug_composition_substancenature_enum" AS ENUM(\'SA\', \'FT\')')
    await queryRunner.query('CREATE TABLE "drug_composition" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "substanceCode" character varying NOT NULL, "substanceName" character varying NOT NULL, "substanceDosage" character varying, "substanceDosageReference" character varying, "substanceNature" "public"."drug_composition_substancenature_enum" NOT NULL, "substancesLinkNumber" integer NOT NULL, "drugId" integer, CONSTRAINT "PK_cbd73e0d814ced99475071ec7ad" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TYPE "public"."drug_specification_marketingauthorizationstatus_enum" AS ENUM(\'Autorisation active\', \'Autorisation abrogée\', \'Autorisation archivée\', \'Autorisation retirée\', \'Autorisation suspendue\')')
    await queryRunner.query('CREATE TYPE "public"."drug_specification_ogdbstatus_enum" AS ENUM(\'Alerte\', \'Warning disponibilité\')')
    await queryRunner.query('CREATE TABLE "drug_specification" ("id" integer NOT NULL, "name" character varying NOT NULL, "form" character varying NOT NULL, "deliveries" text NOT NULL, "marketingAuthorizationStatus" "public"."drug_specification_marketingauthorizationstatus_enum" NOT NULL, "marketingAuthorizationProcedure" character varying NOT NULL, "isBeingMarketed" boolean NOT NULL, "marketingAuthorizationDate" character varying NOT NULL, "ogDbStatus" "public"."drug_specification_ogdbstatus_enum", "europeanAuthorizationNumber" character varying, "holders" text NOT NULL, "reinforcedMonitoring" boolean NOT NULL, "prescriptionRestriction" character varying, CONSTRAINT "PK_988d33d14995cdc8e6e775cfe2f" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TABLE "generic" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_5ade0e1c8a4a45be1b552ca0a6a" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TYPE "public"."drug_generic_type_enum" AS ENUM(\'0\', \'1\', \'2\', \'4\')')
    await queryRunner.query('CREATE TABLE "drug_generic" ("id" SERIAL NOT NULL, "type" "public"."drug_generic_type_enum" NOT NULL, "rank" integer NOT NULL, "drugId" integer, "genericId" integer, CONSTRAINT "PK_73fd112565d25f6f6b9512d180e" PRIMARY KEY ("id"))')
    await queryRunner.query('ALTER TABLE "drug_package" ADD CONSTRAINT "FK_73df88c309bf626cc431536a58c" FOREIGN KEY ("drugId") REFERENCES "drug_specification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "drug_composition" ADD CONSTRAINT "FK_cd9660527269c192702e6bd515c" FOREIGN KEY ("drugId") REFERENCES "drug_specification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "drug_generic" ADD CONSTRAINT "FK_1a040bfcd737696f32dbb7c0284" FOREIGN KEY ("drugId") REFERENCES "drug_specification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "drug_generic" ADD CONSTRAINT "FK_f23dffdbdb7a55e4ad7ed5b0411" FOREIGN KEY ("genericId") REFERENCES "generic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "drug_generic" DROP CONSTRAINT "FK_f23dffdbdb7a55e4ad7ed5b0411"')
    await queryRunner.query('ALTER TABLE "drug_generic" DROP CONSTRAINT "FK_1a040bfcd737696f32dbb7c0284"')
    await queryRunner.query('ALTER TABLE "drug_composition" DROP CONSTRAINT "FK_cd9660527269c192702e6bd515c"')
    await queryRunner.query('ALTER TABLE "drug_package" DROP CONSTRAINT "FK_73df88c309bf626cc431536a58c"')
    await queryRunner.query('DROP TABLE "drug_generic"')
    await queryRunner.query('DROP TYPE "public"."drug_generic_type_enum"')
    await queryRunner.query('DROP TABLE "generic"')
    await queryRunner.query('DROP TABLE "drug_specification"')
    await queryRunner.query('DROP TYPE "public"."drug_specification_ogdbstatus_enum"')
    await queryRunner.query('DROP TYPE "public"."drug_specification_marketingauthorizationstatus_enum"')
    await queryRunner.query('DROP TABLE "drug_composition"')
    await queryRunner.query('DROP TYPE "public"."drug_composition_substancenature_enum"')
    await queryRunner.query('DROP TABLE "drug_package"')
    await queryRunner.query('DROP TYPE "public"."drug_package_marketingauthorizationstatus_enum"')
    await queryRunner.query('DROP TYPE "public"."drug_package_status_enum"')
  }
}
