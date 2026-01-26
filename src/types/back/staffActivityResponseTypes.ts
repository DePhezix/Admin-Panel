export interface staffActivtyType {
  id: string;
  activity_id: string | null;
  worker_id: string;
  org_id: string;
}

export interface staffActivityResponseType {
  data: staffActivtyType[];
  total: number;
  page: number;
  limit: number;
}

export interface completeStaffActivityType extends staffActivtyType {
  activity_name: string;
}