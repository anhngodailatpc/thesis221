interface CompetitionCriteria {
  id: number | string;
  name: string;
  parentId: string;
  note: string;
  isCriteria: boolean;
  type: string;
  soft: number;
  standardPoint: number;
  evidence: boolean;
  createdAt: Date;
  updatedAt: Date;
  children: CompetitionCriteria[];
}
// let a: Criteria;

export type { CompetitionCriteria };
