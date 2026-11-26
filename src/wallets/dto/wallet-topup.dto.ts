import { IsInt, IsPositive, Max } from 'class-validator';

export class WalletTopupDto {
  @IsInt()
  @IsPositive()
  @Max(100_000_000_00)
  amount!: number;
}
