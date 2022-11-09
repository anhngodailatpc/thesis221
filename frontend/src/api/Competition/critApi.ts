import { CompetitionCriteria } from "../../types/BK_Competition/Criterion";
import axiosClient from "../axiosClient";

const CompetitionCritApi = {
  getAll: (id: string): Promise<CompetitionCriteria[]> => {
    const url = `/competition/criteria/${id}`;
    return axiosClient.get(url);
  },
  add: (id: string, item: any): Promise<CompetitionCriteria> => {
    const url = `/competition/criteria/${id}`;
    console.log(item);
    return axiosClient.post(url, item);
  },
  update: (
    id: string,
    item: CompetitionCriteria
  ): Promise<CompetitionCriteria> => {
    const url = `/criteria/${id}`;
    return axiosClient.put(url, item);
  },
  delete: (id: string): Promise<CompetitionCriteria> => {
    const url = `/criteria/${id}`;
    return axiosClient.delete(url);
  },
};

export default CompetitionCritApi;
