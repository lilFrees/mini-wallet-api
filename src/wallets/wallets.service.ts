import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WalletsService {
  constructor(@InjectRepository(Wallet) private repo: Repository<Wallet>) {}

  async findByUserId(userId: string) {
    const wallet = await this.repo.findOne({ where: { id: userId } });

    if (!wallet) throw new BadRequestException('Wallet not found');

    return wallet;
  }
}
