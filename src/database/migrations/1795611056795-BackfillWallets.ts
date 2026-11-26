import { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillWallets1795611056795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "wallets" ("user_id", "balance", "currency", "version")
        SELECT "u"."id", 0, 'UZS', 1
        FROM "users" "u"
        WHERE NOT EXISTS (
            SELECT 1 from "wallets" "w" WHERE "w"."user_id" = "u"."id"
        )    
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
