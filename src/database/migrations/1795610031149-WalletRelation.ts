import { MigrationInterface, QueryRunner } from 'typeorm';

export class WalletRelation1795610031149 implements MigrationInterface {
  name = 'WalletRelation1795610031149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "currency" character varying(3) NOT NULL DEFAULT 'UZS'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "version" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD CONSTRAINT "UQ_92558c08091598f7a4439586cda" UNIQUE ("user_id")`,
    );
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "balance"`);
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "balance" bigint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD CONSTRAINT "FK_92558c08091598f7a4439586cda" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP CONSTRAINT "FK_92558c08091598f7a4439586cda"`,
    );
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "balance"`);
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "balance" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP CONSTRAINT "UQ_92558c08091598f7a4439586cda"`,
    );
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "user_id" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "version"`);
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "currency"`);
  }
}
