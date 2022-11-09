import axiosClient from "../axiosClient";
import ActivityCampaign from "../../types/ActivityCampaign";
import queryString from "query-string";

const activityCampaignApi = {
  add: (newCampaign: ActivityCampaign): Promise<any> => {
    const url = "/activityCampaign/add-campaign";
    return axiosClient.post(url, newCampaign);
  },
  getAll: (): Promise<any> => {
    const url = "/activityCampaign";
    return axiosClient.get(url);
  },
  getAllWithFilter: (filter: any): Promise<any> => {
    const paramsString = queryString.stringify(filter);
    const url = `/activityCampaign/use-filter?${paramsString}`;
    return axiosClient.get(url);
  },
  getAllActive: (): Promise<any> => {
    const url = `/activityCampaign/active`;
    return axiosClient.get(url);
  },
  modify: (campaign: ActivityCampaign): Promise<any> => {
    const url = "/activityCampaign/modify-campaign";
    return axiosClient.put(url, campaign);
  },
  delete: (id: string): Promise<any> => {
    const url = "/activityCampaign";
    return axiosClient.delete(`${url}/${id}`);
  },
};

export default activityCampaignApi;
