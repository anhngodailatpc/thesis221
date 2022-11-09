import { Role } from './../common/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsInt, IsEnum, IsEmail } from 'class-validator';

export class ManagerDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsInt()
  mssv: number;

  @ApiProperty()
  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: Role;
}
