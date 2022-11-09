interface Activity {
  id: string;
  name: string;
  maximumParticipant: number;
  campaignId: string;
  activityGroupId: string;
  maximumCTXH: number;
  registerStartDay: Date;
  registerEndDay: Date;
  startDay: Date;
  endDay: Date;
  falcutyInclude: string[];
  link: string;
  content: string;
}
export default Activity;
