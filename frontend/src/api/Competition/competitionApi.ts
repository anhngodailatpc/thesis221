import Competition from "../../types/BK_Competition/Competitition";
import axiosClient from "../axiosClient";
import queryString from "query-string";

const competitionApi = {
  getAll: (): Promise<Competition[]> => {
    const url = "/competition";
    return axiosClient.get(url);
  },
  getWithFilter: (
    filters: any,
    managerAchievement: boolean = false
  ): Promise<{
    data: Competition[];
    count: number;
  }> => {
    //if (managerAchievement) filters.isAuditor = true;
    const paramsString = queryString.stringify(filters);
    const url = `/competition/filter?${paramsString}`;
    return axiosClient.get(url);
  },
  getAllWithFilter: (
    filters: any,
    managerAchievement: boolean = false
  ): Promise<{
    data: Competition[];
    count: number;
  }> => {
    //if (managerAchievement) filters.isAuditor = true;
    const paramsString = queryString.stringify(filters);
    const url = `/competition/all/filter?${paramsString}`;
    return axiosClient.get(url);
  },
  get: (id: number): Promise<Competition> => {
    const url = `/competition/${id}`;
    return axiosClient.get(url);
  },
  add: (data: Competition): Promise<Competition> => {
    const url = "/competition";
    return axiosClient.post(url, data);
  },
  update: (id: string, data: Competition): Promise<Competition> => {
    const url = "/competition";
    return axiosClient.put(`${url}/${id}`, data);
  },
  delete: (id: string): Promise<Competition> => {
    const url = "/competition";
    return axiosClient.delete(`${url}/${id}`);
  },
  loginGoogle: (): Promise<any> => {
    const url = "/google";
    return axiosClient.get(url);
  },
  getResult: (
    id: number,
    filters: any
  ): Promise<{
    data: any[];
    count: number;
  }> => {
    const paramsString = queryString.stringify(filters);
    const url = `/competition/resultUser/${id}?${paramsString}`;
    return axiosClient.get(url);
  },
  getStatus: (id: number): Promise<any> => {
    const url = `/competition/status/${id}`;
    return axiosClient.get(url);
  },
  setStatus: (status: string, id: number): Promise<any> => {
    const url = `/competition/status/${id}`;
    return axiosClient.put(url, { status });
  },
  getSummary: (
    id: number,
    filters: any
  ): Promise<{
    data: any[];
    countSubmission: number;
    countDepartment: number;
  }> => {
    const paramsString = queryString.stringify(filters);
    const url = `/competition/summary/${id}?${paramsString}`;
    return axiosClient.get(url);
  },
  getUserSubmission: (
    id: number,
    filters: any
  ): Promise<{
    data: any[];
    count: number;
  }> => {
    const paramsString = queryString.stringify(filters);
    const url = `/competition/users/submission/${id}?${paramsString}`;
    return axiosClient.get(url);
  },
};

export default competitionApi;
