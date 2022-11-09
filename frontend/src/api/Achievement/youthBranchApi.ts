import queryString from 'query-string'
import { YouthBranch } from '../../types/YouthBranch'
import axiosClient from '../axiosClient'
const YouthBranchApi = {
  get: async (
    filters: any
  ): Promise<{
    data: YouthBranch[]
    count: number
  }> => {
    const paramsString = queryString.stringify(filters)
    const url = `/youthBranch?${paramsString}`
    return axiosClient.get(url)
  },
  create: async (code: string, data: { name: string }): Promise<any> => {
    const url = `/youthBranch/${code}`
    return axiosClient.post(url, data)
  },
  update: async (
    code: string,
    id: string,
    data: { name: string }
  ): Promise<any> => {
    const url = `/youthBranch/${code}/${id}`
    return axiosClient.put(url, data)
  },
}
export default YouthBranchApi
