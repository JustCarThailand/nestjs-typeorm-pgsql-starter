import { CreateDebtCollectionDto } from './create-debt-collection.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateDebtCollectionDto extends OmitType(CreateDebtCollectionDto, [
  'lat',
  'lng',
  'jobCode',
] as const) {}
