import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  profile?: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    empCode?: string;
  };

  @IsOptional()
  roleIds?: number[]; // List of `BaseRoles` IDs
}
