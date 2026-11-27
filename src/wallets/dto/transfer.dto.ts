import { IsEmail, IsInt, IsPositive, Max } from 'class-validator';

export class TransferDto {
  @IsEmail()
  recipientEmail!: string;

  @IsInt()
  @IsPositive()
  @Max(100_000_000_00)
  amount!: number;
}
