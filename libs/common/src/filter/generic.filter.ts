import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';

export enum sort_order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GenericFilter {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({ default: 1, required: false })
  public page: number = 1;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({ default: 10, required: false })
  public page_size: number = 10;

  @IsOptional()
  @IsEnum(sort_order)
  @ApiProperty({ default: sort_order.DESC, required: false, description: 'ASC,DESC' })
  public sort_order?: sort_order = sort_order.DESC;
}
