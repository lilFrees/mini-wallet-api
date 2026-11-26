import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionType } from '../transactions/transaction.enums';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet) private repo: Repository<Wallet>,
    private dataSource: DataSource,
  ) {}

  async findByUserId(userId: string) {
    const wallet = await this.repo.findOne({ where: { userId } });

    if (!wallet) throw new NotFoundException('Wallet not found');

    return wallet;
  }

  topup(userId: string, amount: number) {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await manager.findOne(Wallet, { where: { userId } });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      await manager.increment(Wallet, { id: wallet.id }, 'balance', amount);

      const record = manager.create(Transaction, {
        fromWalletId: null,
        toWalletId: wallet.id,
        type: TransactionType.TOPUP,
        amount,
      });

      await manager.save(record);

      const updated = await manager.findOneByOrFail(Wallet, { id: wallet?.id });

      return { balance: updated.balance, transaction: record };
    });
  }
}
