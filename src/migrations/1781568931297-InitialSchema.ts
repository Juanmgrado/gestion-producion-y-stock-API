import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1781568931297 implements MigrationInterface {
    name = 'InitialSchema1781568931297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(35) NOT NULL, "email" character varying(30) NOT NULL, "password" character varying NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "product" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "userUuid" uuid, CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name"), CONSTRAINT "CHK_35f9a18fbac915618a6c3e435b" CHECK ("stock" >= 0), CONSTRAINT "PK_1442fd7cb5e0b32ff5d0b6c13d0" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TYPE "public"."stock_movement_typemovement_enum" AS ENUM('IN', 'OUT')`);
        await queryRunner.query(`CREATE TABLE "stock_movement" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "note" character varying DEFAULT '', "typeMovement" "public"."stock_movement_typemovement_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "productUuid" uuid NOT NULL, "userUuid" uuid, CONSTRAINT "PK_180f366657ca71ef26eef585172" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "stock_adjustment" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "productUuid" uuid NOT NULL, "adjustedByUuid" uuid NOT NULL, "expectedStock" integer NOT NULL, "actualStock" integer NOT NULL, "difference" integer NOT NULL, "reason" text, "note" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_726d610ac4671a56f6fb9aea8e3" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_46bf93192320ce212bcee39c548" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_movement" ADD CONSTRAINT "FK_ab85c926f405c813bda07be07e8" FOREIGN KEY ("productUuid") REFERENCES "product"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_movement" ADD CONSTRAINT "FK_18aa1d1d5fe9abe36301e0c8ae2" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" ADD CONSTRAINT "FK_b3bfc1cb3d7c0fa9fb7683b657c" FOREIGN KEY ("productUuid") REFERENCES "product"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" ADD CONSTRAINT "FK_1f3338bb27a8d4ffd56d151b01d" FOREIGN KEY ("adjustedByUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_adjustment" DROP CONSTRAINT "FK_1f3338bb27a8d4ffd56d151b01d"`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment" DROP CONSTRAINT "FK_b3bfc1cb3d7c0fa9fb7683b657c"`);
        await queryRunner.query(`ALTER TABLE "stock_movement" DROP CONSTRAINT "FK_18aa1d1d5fe9abe36301e0c8ae2"`);
        await queryRunner.query(`ALTER TABLE "stock_movement" DROP CONSTRAINT "FK_ab85c926f405c813bda07be07e8"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_46bf93192320ce212bcee39c548"`);
        await queryRunner.query(`DROP TABLE "stock_adjustment"`);
        await queryRunner.query(`DROP TABLE "stock_movement"`);
        await queryRunner.query(`DROP TYPE "public"."stock_movement_typemovement_enum"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
