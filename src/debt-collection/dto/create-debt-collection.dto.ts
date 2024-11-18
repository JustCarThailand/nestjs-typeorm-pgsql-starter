import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDebtCollectionDto {
  @ApiProperty({ description: 'job code from just loan' })
  @IsNotEmpty()
  @IsString()
  jobCode: string;

  @ApiProperty({ description: 'Full name of the follower' })
  @IsNotEmpty()
  @IsString()
  followerName: string;

  @ApiProperty({ description: 'Date of follow-up' })
  @IsNotEmpty()
  @IsString()
  followDate: Date;

  @ApiProperty({ description: 'Full name of the borrower' })
  @IsNotEmpty()
  @IsString()
  borrowerFullName: string;

  @ApiProperty({ description: 'The follow-up channel used, e.g., phone, email' })
  @IsNotEmpty()
  @IsString()
  followChannel: string;

  @ApiProperty({ description: 'Latest phone number for contact' })
  @IsNotEmpty()
  @IsString()
  latestPhoneNumber: string;

  @ApiProperty({ description: 'Description or notes on the follow-up' })
  @IsOptional()
  @IsString()
  followDescription?: string;

  @ApiProperty({ description: 'Status id' })
  @IsNotEmpty()
  @IsInt()
  followStatusId: number;

  // @ApiProperty({ description: 'File Id', type: Array })
  // @IsNotEmpty()
  // @IsArray()
  // fileId: number[];

  @ApiProperty({ description: 'Latitude' })
  @IsNotEmpty()
  @IsString()
  lat: string;

  @ApiProperty({ description: 'Longtitude' })
  @IsNotEmpty()
  @IsString()
  lng: string;
}
