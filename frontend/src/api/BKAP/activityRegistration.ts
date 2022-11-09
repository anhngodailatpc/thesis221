import queryString from "query-string";
import axiosClient from "../axiosClient";

const activityRegistrationApi = {
  get: (filters: any): Promise<any> => {
    const paramsString = queryString.stringify(filters);
    const url = `/registration?${paramsString}`;
    return axiosClient.get(url);
  },
  getRegistered: (filters: any, id: string): Promise<any> => {
    const paramsString = queryString.stringify(filters);
    const url = `/registration/${id}?${paramsString}`;
    return axiosClient.get(url);
  },
  getUserHistory: (filters: any, id: string): Promise<any> => {
    const paramsString = queryString.stringify(filters);
    const url = `/registration/user-history/${id}?${paramsString}`;
    return axiosClient.get(url);
  },
  updateRegistration: (status: string, id: string): Promise<any> => {
    const url = `/registration/status/${id}`;
    return axiosClient.post(url, { status });
  },
  QRReg: (status: string, id: string): Promise<any> => {
    const url = `/registration/qr-reg/${id}`;
    return axiosClient.post(url, { status });
  },
  updateRegistered: (status: string, id: string, activityId: string): Promise<any> => {
    const url = `/registration/status/${activityId}/${id}`;
    return axiosClient.put(url, { status });
  },
  updateRegisteredExcel: (excel: string[], activityId: string): Promise<any> => {
    const url = `/registration/status/excel`
    return axiosClient.put(url, { excel, activityId });
  },
};

export default activityRegistrationApi;
