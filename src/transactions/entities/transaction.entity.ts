import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionType } from '../transaction.enums';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { bigintToNumber } from '../../database/bigint.transformer';

@Entity({ name: 'transactions' })
@Index(['fromWalletId', 'createdAt'])
@Index(['toWalletId', 'createdAt'])
@Check('CHK_transactions_amount_positive', `"amount" > 0`)
@Check(
  'CHK_transactions_sender_matches_type',
  `("type" = 'topup' AND "from_wallet_id" IS NULL) OR ("type" = 'transfer' AND "from_wallet_id" IS NOT NULL)`,
)
@Check(
  'CHK_transactions_not_self',
  `"from_wallet_id" IS DISTINCT FROM "to_wallet_id"`,
)
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  fromWalletId!: string | null;

  @ManyToOne(() => Wallet, { nullable: true })
  @JoinColumn({ name: 'from_wallet_id' })
  fromWallet!: Wallet | null;

  @Column({ type: 'uuid' })
  toWalletId!: string;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'to_wallet_id' })
  toWallet!: Wallet;

  @Column({ type: 'enum', enum: TransactionType, enumName: 'transaction_type' })
  type!: TransactionType;

  // Amount in tiyin
  @Column({ type: 'bigint', transformer: bigintToNumber })
  amount!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
