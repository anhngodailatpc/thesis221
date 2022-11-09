import { YouthBranch } from "./YouthBranch";

interface Department {
  id: number
  code: string
  name: string
  createdAt: Date
  UpdatedAt: Date
  youthBranch: YouthBranch[]
}

export interface DepartmentNotYouthBranch {
  id: number
  code: string
  name: string
  createdAt: Date
  UpdatedAt: Date
}
export default Department;
