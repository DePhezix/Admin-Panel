export interface activityType {
  id: string;
  name: string;
  org_id: string;
}

export interface activityResponseType {
  data: activityType[];
  total: number;
  page: number;
  limit: number;
}
