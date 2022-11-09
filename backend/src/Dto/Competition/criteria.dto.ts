import { ApiProperty } from '@nestjs/swagger';
import { CriteriaType } from 'src/common/enum';

export class CriteriaDto {
  @ApiProperty({ nullable: false })
  id: string;

  @ApiProperty({ nullable: true })
  parentId: string;

  @ApiProperty({ nullable: false })
  name: string;

  @ApiProperty({ default: false })
  isCriteria: boolean;

  @ApiProperty({ default: '' })
  note: string;

  @ApiProperty({ enum: ['hard', 'soft'] })
  type: CriteriaType;

  @ApiProperty({ nullable: false })
  evidence: boolean;

  @ApiProperty({ nullable: true })
  standardPoint: number;

  @ApiProperty({ nullable: false })
  soft: number;
}
