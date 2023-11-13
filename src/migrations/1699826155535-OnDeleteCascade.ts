import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class OnDeleteCascade1699826155535 implements MigrationInterface {
  name = 'OnDeleteCascade1699826155535'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "api_key" DROP CONSTRAINT "FK_74d2236b1de818d00bd3fd01602"')
    await queryRunner.query('ALTER TABLE "drug_package" DROP CONSTRAINT "FK_73df88c309bf626cc431536a58c"')
    await queryRunner.query('ALTER TABLE "drug_composition" DROP CONSTRAINT "FK_cd9660527269c192702e6bd515c"')
    await queryRunner.query('ALTER TABLE "drug_generic" DROP CONSTRAINT "FK_1a040bfcd737696f32dbb7c0284"')
    await queryRunner.query('ALTER TABLE "drug_generic" DROP CONSTRAINT "FK_f23dffdbdb7a55e4ad7ed5b0411"')
    await queryRunner.query('ALTER TABLE "api_key" ADD CONSTRAINT "FK_74d2236b1de818d00bd3fd01602" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "drug_package" ADD CONSTRAINT "FK_73df88c309bf626cc431536a58c" FOREIGN KEY ("drugId") REFERENCES "drug_specification"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "drug_composition" ADD CONSTRAINT "FK_cd9660527269c192702e6bd515c" FOREIGN KEY ("drugId") REFERENCES "drug_specification"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "drug_generic" ADD CONSTRAINT "FK_1a040bfcd737696f32dbb7c0284" FOREIGN KEY ("drugId") REFERENCES "drug_specification"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "drug_generic" ADD CONSTRAINT "FK_f23dffdbdb7a55e4ad7ed5b0411" FOREIGN KEY ("genericId") REFERENCES "generic"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "drug_generic" DROP CONSTRAINT "FK_f23dffdbdb7a55e4ad7ed5b0411"')
    await queryRunner.query('ALTER TABLE "drug_generic" DROP CONSTRAINT "FK_1a040bfcd737696f32dbb7c0284"')
    await queryRunner.query('ALTER TABLE "drug_composition" DROP CONSTRAINT "FK_cd9660527269c192702e6bd515c"')
    await queryRunner.query('ALTER TABLE "drug_package" DROP CONSTRAINT "FK_73df88c309bf626cc431536a58c"')
    await queryRunner.query('ALTER TABLE "api_key" DROP CONSTRAINT "FK_74d2236b1de818d00bd3fd01602"')
    await queryRunner.query('ALTER TABLE "drug_generic" ADD CONSTRAINT "FK_f23dffdbdb7a55e4ad7ed5b0411" FOREIGN KEY ("genericId") REFERENCES "generic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "drug_generic" ADD CONSTRAINT "FK_1a040bfcd737696f32dbb7c0284" FOREIGN KEY ("drugId") REFERENCES "drug_specification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "drug_composition" ADD CONSTRAINT "FK_cd9660527269c192702e6bd515c" FOREIGN KEY ("drugId") REFERENCES "drug_specification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "drug_package" ADD CONSTRAINT "FK_73df88c309bf626cc431536a58c" FOREIGN KEY ("drugId") REFERENCES "drug_specification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "api_key" ADD CONSTRAINT "FK_74d2236b1de818d00bd3fd01602" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }
}
