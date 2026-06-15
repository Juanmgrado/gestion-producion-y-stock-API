import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustmentColumnRename1780751370583 implements MigrationInterface {
    name = 'AdjustmentColumnRename1780751370583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_adjustment" DROP CONSTRAINT "FK_977be3e9dfc29a54d25d7649391"`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" DROP CONSTRAINT "FK_1bb542cc5c764c1b5d1d76e1b7d"`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" DROP COLUMN "adjustedById"`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" ADD "productUuid" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" ADD "adjustedByUuid" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" ADD CONSTRAINT "FK_b3bfc1cb3d7c0fa9fb7683b657c" FOREIGN KEY ("productUuid") REFERENCES "product"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" ADD CONSTRAINT "FK_1f3338bb27a8d4ffd56d151b01d" FOREIGN KEY ("adjustedByUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_adjustment" DROP CONSTRAINT "FK_1f3338bb27a8d4ffd56d151b01d"`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" DROP CONSTRAINT "FK_b3bfc1cb3d7c0fa9fb7683b657c"`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" DROP COLUMN "adjustedByUuid"`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" DROP COLUMN "productUuid"`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" ADD "adjustedById" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" ADD "productId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" ADD CONSTRAINT "FK_1bb542cc5c764c1b5d1d76e1b7d" FOREIGN KEY ("adjustedById") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" ADD CONSTRAINT "FK_977be3e9dfc29a54d25d7649391" FOREIGN KEY ("productId") REFERENCES "product"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
