import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'wallets' })
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({
    type: 'bigint',
    default: 0,
    transformer: { to: (v: number) => v, from: (v: string) => Number(v) },
  })
  balance!: number;

  @Column({ length: 3, default: 'UZS' })
  currency!: string;

  @VersionColumn()
  version!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
