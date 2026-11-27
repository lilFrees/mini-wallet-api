import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  transfer(userId: string, toEmail: string, amount: number) {
    return this.dataSource.transaction(async (manager) => {
      const fromWallet = await manager.findOne(Wallet, { where: { userId } });
      const toWallet = await manager.findOne(Wallet, {
        where: { user: { email: toEmail } },
      });

      if (!fromWallet) {
        throw new NotFoundException("Sender's Wallet not found");
      }

      if (!toWallet) {
        throw new NotFoundException("Recipient's wallet not found");
      }

      if (fromWallet.id === toWallet.id) {
        throw new BadRequestException('Cannot transfer to yourself');
      }

      const ids = [fromWallet.id, toWallet.id].sort();
      const locked: Wallet[] = [];

      for (const id of ids) {
        locked.push(
          await manager.findOneOrFail(Wallet, {
            where: { id },
            lock: { mode: 'pessimistic_write' },
          }),
        );
      }

      const sender = locked.find((w) => w.id === fromWallet.id)!;
      if (sender.balance < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      await manager.increment(Wallet, { id: toWallet.id }, 'balance', amount);

      await manager.decrement(Wallet, { id: fromWallet.id }, 'balance', amount);

      const record = manager.create(Transaction, {
        fromWalletId: fromWallet.id,
        amount,
        toWalletId: toWallet.id,
        type: TransactionType.TRANSFER,
      });

      await manager.save(record);

      const updated = await manager.findOneByOrFail(Wallet, {
        id: fromWallet.id,
      });

      return { balance: updated.balance, transaction: record };
    });
  }
}
