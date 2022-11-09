import { ApiProperty } from '@nestjs/swagger';

export class CompetitionCreateDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: true })
  endAt: Date;

  @ApiProperty({ required: true })
  startAt: Date;
}
