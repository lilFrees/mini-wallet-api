import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { bigintToNumber } from '../../database/bigint.transformer';

@Entity({ name: 'wallets' })
@Check('CHK_wallets_balance_non_negative', '"balance" >= 0')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // Balance in tiyin
  @Column({ type: 'bigint', default: 0, transformer: bigintToNumber })
  balance!: number;

  @Column({ length: 3, default: 'UZS' })
  currency!: string;

  @VersionColumn()
  version!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
