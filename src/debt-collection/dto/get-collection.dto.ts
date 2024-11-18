import { GenericFilter } from '@app/common/filter';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { DebtCollection } from 'src/entities/debt-collection.entity';

export class GetDebtCollectionDto extends GenericFilter {
  @ApiProperty({ description: 'The unique case ID for the debt collection', required: false })
  @IsOptional()
  caseId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  jobCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  borrowerFullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  followerName?: string;

  @ApiProperty({ isArray: true, required: false })
  @IsOptional()
  statuses?: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  fromFollowDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  toFollowDate?: Date;
}

export class ResponseUserListDto {
  @ApiProperty({ type: () => DebtCollection, isArray: true })
  items: DebtCollection;

  @ApiProperty()
  page: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  item_count: number;

  @ApiProperty()
  page_count: number;

  @ApiProperty()
  has_previous: boolean;

  @ApiProperty()
  has_next: boolean;
}
