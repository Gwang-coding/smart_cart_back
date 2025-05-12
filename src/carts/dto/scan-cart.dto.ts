import { IsString } from 'class-validator';

export class ScanCartDto {
  @IsString()
  token: string;
}
