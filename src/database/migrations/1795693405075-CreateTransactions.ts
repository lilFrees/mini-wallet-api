import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransactions1795693405075 implements MigrationInterface {
  name = 'CreateTransactions1795693405075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type" AS ENUM('topup', 'transfer')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from_wallet_id" uuid, "to_wallet_id" uuid NOT NULL, "type" "public"."transaction_type" NOT NULL, "amount" bigint NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "CHK_transactions_not_self" CHECK ("from_wallet_id" IS DISTINCT FROM "to_wallet_id"), CONSTRAINT "CHK_transactions_sender_matches_type" CHECK (("type" = 'topup' AND "from_wallet_id" IS NULL) OR ("type" = 'transfer' AND "from_wallet_id" IS NOT NULL)), CONSTRAINT "CHK_transactions_amount_positive" CHECK ("amount" > 0), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_232ac97a23e06533e578e04151" ON "transactions"  ("to_wallet_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f479031c517e46201b70da977b" ON "transactions"  ("from_wallet_id", "created_at") `,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_c337cc8fd8b43b3e8414f6464ec" FOREIGN KEY ("from_wallet_id") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_0ead82990d0099eecec1fa10a29" FOREIGN KEY ("to_wallet_id") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_0ead82990d0099eecec1fa10a29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_c337cc8fd8b43b3e8414f6464ec"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f479031c517e46201b70da977b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_232ac97a23e06533e578e04151"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_type"`);
  }
}
