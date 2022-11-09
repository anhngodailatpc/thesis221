import queryString from 'query-string'
import axiosClient from '../axiosClient'
import Activity from '../../types/Activity'

const activityApi = {
  add: (data: Activity): Promise<any> => {
    const url = '/activity/add'
    return axiosClient.post(url, data)
  },
  updateStatus: (data: {
    id: string
    status: string
    noteStatus: string
  }): Promise<any> => {
    const url = '/activity/add/status'
    return axiosClient.put(url, data)
  },
  update: (data: any, id: string): Promise<any> => {
    const url = `/activity/${id}`
    return axiosClient.put(url, data)
  },
  get: (filters: any): Promise<any> => {
    const paramsString = queryString.stringify(filters)
    const url = `/activity?${paramsString}`
    return axiosClient.get(url)
  },
  delete: (id: string): Promise<any> => {
    const url = '/activity'
    return axiosClient.delete(`${url}/${id}`)
  },
}

export default activityApi
