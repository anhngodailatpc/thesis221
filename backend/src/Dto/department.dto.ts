import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class YouthBranchDto {
  @ApiProperty()
  name: string;
}

export class YouthBranchDepartmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150, {
    message: 'vui lòng nhập ít hơn $constraint1 ký tự',
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150, {
    message: 'vui lòng nhập ít hơn $constraint1 ký tự',
  })
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150, {
    message: 'vui lòng nhập ít hơn $constraint1 ký tự',
  })
  youthBranch: string;
}

export class DepartmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150, {
    message: 'vui lòng nhập ít hơn $constraint1 ký tự',
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150, {
    message: 'vui lòng nhập ít hơn $constraint1 ký tự',
  })
  code: string;
}
