interface ActivityGroupExtend {
  id: string;
  name: string;
  maximumActivity: number;
  campaignId: string;
  campaignName: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default ActivityGroupExtend;
