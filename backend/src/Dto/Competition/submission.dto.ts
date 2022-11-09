import { ApiProperty } from '@nestjs/swagger';

export class CompetitionSubmissionDto {
  @ApiProperty({ required: false })
  id: string;

  @ApiProperty({ required: false })
  userId: number;

  @ApiProperty({ required: false })
  competitionId: number;

  @ApiProperty({ required: false })
  criteriaID: string;

  @ApiProperty()
  file: string;

  @ApiProperty()
  studentComment: string;

  @ApiProperty({ required: false })
  point: number;

  @ApiProperty({ required: false })
  description: string;
}
