export interface staffType {
  id: string;
  name: string;
  surname: string;
  org_id: string;
}

export interface staffResponseType {
  data: staffType[];
  total: number;
  page: number;
  limit: number;
}
