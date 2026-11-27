import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { WalletsService } from './wallets.service';
import { type Request } from 'express';
import { WalletTopupDto } from './dto/wallet-topup.dto';
import { TransferDto } from './dto/transfer.dto';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private walletService: WalletsService) {}

  @Get()
  getMyWallet(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.walletService.findByUserId(user.id);
  }

  @Post('topup')
  topupWallet(@Req() req: Request, @Body() dto: WalletTopupDto) {
    const user = req.user as { id: string };
    return this.walletService.topup(user.id, dto.amount);
  }

  @Post('transfer')
  transferMoney(@Req() req: Request, @Body() dto: TransferDto) {
    const user = req.user as { id: string };
    return this.walletService.transfer(user.id, dto.recipientEmail, dto.amount);
  }
}
