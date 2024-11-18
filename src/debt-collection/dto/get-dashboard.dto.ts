import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetDashboardDto {
  @ApiProperty({ description: '2024-01-15' })
  @IsNotEmpty()
  @IsString()
  from_date: string;

  @ApiProperty({ description: '2024-11-15' })
  @IsNotEmpty()
  @IsString()
  to_date: string;
}
