export interface analayticsResponseType {
  organizations: {
    total_org: number;
    covered_org: number;
  };
  workers: {
    total_worker: number;
    covered_worker: number;
  };
  agents: {
    total_agent: number;
    covered_agent: number;
  };
  activities: {
    total_activity: number;
    covered_activity: number;
  };
}