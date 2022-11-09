import { ApiProperty } from '@nestjs/swagger';
import { CriteriaType } from 'src/common/enum';
import { CriteriaDto } from './criteria.dto';

export class CriteriaUpdateDto {
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

  @ApiProperty({ nullable: false })
  children: CriteriaDto[];
}
// [
//   {
//     "id":"405f7496-fb55-42f1-9a3d-30e7b0a7612f",
//     "parentId": null,
//     "name": "Tieu chi 1",
//     "isCriteria": false,
//     "note": "",
//     "type": "hard",
//     "evidence": true,
//     "standardPoint": 100,
//     "soft": 0,
//     "children": [
//       {
//         "id":"405f7496-fb55-42f1-9a3d-30e7b0a7612f",
//         "parentId": null,
//         "name": "Tieu chi 1",
//         "isCriteria": false,
//         "note": "",
//         "type": "hard",
//         "evidence": true,
//         "standardPoint": 100,
//         "soft": 0,
//       },
//       {
//         "id":"405f7496-fb55-42f1-9a3d-30e7b0a7612f",
//         "parentId": null,
//         "name": "Tieu chi 1",
//         "isCriteria": false,
//         "note": "",
//         "type": "hard",
//         "evidence": true,
//         "standardPoint": 100,
//         "soft": 0,
//       }
//     ]
//   }
// ]
