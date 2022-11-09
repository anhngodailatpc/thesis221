interface Submission {
  id: number | string;
  userId: number;
  achievementId: number;
  criteriaID: number | string;
  file: string;
  point: number; //Dùng cho tiêu chí thang điểm
  binary: boolean; //Dùng cho tiêu chí nhị phân : đạt / k đạt
  description: string;
  studentComment: string;
  studentSelect: string;
}

export type { Submission };
