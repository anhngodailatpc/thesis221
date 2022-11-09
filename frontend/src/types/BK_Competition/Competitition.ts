interface Competition {
  id?: number;
  name?: string;
  lock?: string;
  softCriteria?: number;
  description?: string;
  auditorFinal?: any;
  auditors?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  endAt?: Date | null;
  startAt?: Date | null;
}

export default Competition;
