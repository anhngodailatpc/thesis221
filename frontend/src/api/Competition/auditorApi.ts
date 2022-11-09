import axiosClient from '../axiosClient'
import queryString from 'query-string'

const AuditorApi = {
  createResultOfCriteria: (
    data: any = [],
    achievement: number,
    resultFinal: boolean,
    examer: number
  ): Promise<string> => {
    const url = `/auditor/${achievement}/${examer}`
    return axiosClient.post(url, { resultFinal, data })
  },
  getSubmissionExamers: (
    achievement: number,
    userId: number,
    users: number[]
  ): Promise<any> => {
    const paramsString = users.length !== 0 ? users.toString() : '-999'
    const url = `/auditor/${achievement}/${userId}?listUser=${paramsString}`
    return axiosClient.get(url)
  },
  getResultSubmission: (submission: string): Promise<any> => {
    const url = `/auditor/${submission}`
    return axiosClient.get(url)
  },
  getResult: (achievement: number, examer: number): Promise<any> => {
    const url = `/submission/result/${achievement}/${examer}`
    return axiosClient.get(url)
  },
  getUsers: (
    achievement: number,
    auditor: number = -999,
    filters: any
  ): Promise<any> => {
    const paramsString = queryString.stringify(filters)
    const url = `/submission/${achievement}/${auditor}?${paramsString}`
    return axiosClient.get(url)
  },
  getAuditorsForCompetition: (achievementId: number): Promise<any> => {
    const url = `/achievement/auditor/${achievementId}`
    return axiosClient.get(url)
  },
  updateAuditorsForCompetition: (
    achievementId: number,
    data: any
  ): Promise<any> => {
    const url = `/achievement/auditor/${achievementId}`
    return axiosClient.put(url, data)
  },
}

export default AuditorApi
