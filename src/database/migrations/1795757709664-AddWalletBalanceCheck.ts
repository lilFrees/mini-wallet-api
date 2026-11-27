import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWalletBalanceCheck1795757709664 implements MigrationInterface {
    name = 'AddWalletBalanceCheck1795757709664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" ADD CONSTRAINT "CHK_wallets_balance_non_negative" CHECK ("balance" >= 0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" DROP CONSTRAINT "CHK_wallets_balance_non_negative"`);
    }

}
