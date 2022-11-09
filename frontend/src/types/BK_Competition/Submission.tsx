interface CompetitionSubmission {
  id: number | string;
  userId: number;
  competitionId: number;
  criteriaID: number | string;
  file: string;
  point: number;
  description: string;
  studentComment: string;
}

export type { CompetitionSubmission };
