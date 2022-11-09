import axiosClient from "../axiosClient";
import ActivityGroup from "../../types/ActivityGroup";
import ActivityGroupExtend from "../../types/ActivityGroupExtend";
import queryString from "query-string";

const activityGroupApi = {
  add: (newGroup: ActivityGroup): Promise<any> => {
    const url = '/activityGroup/add-group'
    return axiosClient.post(url, newGroup)
  },
  getAll: (): Promise<any> => {
    const url = '/activityGroup'
    return axiosClient.get(url)
  },
  getAllLimitActive: (): Promise<any> => {
    const url = '/activityGroup/limit'
    return axiosClient.get(url)
  },
  getAllWithFilter: (filter: any): Promise<any> => {
    const paramsString = queryString.stringify(filter)
    const url = `/activityGroup/use-filter?${paramsString}`
    return axiosClient.get(url)
  },
  update: (group: ActivityGroupExtend): Promise<any> => {
    const url = '/activityGroup/modify-group'
    return axiosClient.put(url, group)
  },
  delete: (id: string): Promise<any> => {
    const url = '/activityGroup'
    return axiosClient.delete(`${url}/${id}`)
  },
}

export default activityGroupApi;
