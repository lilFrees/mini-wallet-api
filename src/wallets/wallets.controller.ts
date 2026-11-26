import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { WalletsService } from './wallets.service';
import { type Request } from 'express';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private walletService: WalletsService) {}

  @Get()
  getMyWallet(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.walletService.findByUserId(user.id);
  }
}
