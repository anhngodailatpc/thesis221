import { ApiProperty } from '@nestjs/swagger';
import { Criteria } from '../models/Achievement/criteria.entity';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  IsDate,
  IsEmpty,
} from 'class-validator';

export class ActivityGroupDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150, {
    message: 'vui lòng nhập ít hơn xxxx ký tự',
  })
  id: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150, {
    message: 'vui lòng nhập ít hơn xxxx ký tự',
  })
  name: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsEmpty()
  maximumActivity: number;

  @ApiProperty({ required: false })
  campaignId: string;
}
