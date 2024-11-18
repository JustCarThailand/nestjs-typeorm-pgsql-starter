import { ApiProperty, OmitType } from '@nestjs/swagger';

import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password', 'roleIds'] as const) {
  @ApiProperty({ example: [1, 2] })
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  roleIds: number[];

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
