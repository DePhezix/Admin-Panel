export interface organizationType {
  id: string;
  name: string;
}

export interface organizationResponseType {
  data: organizationType[];
  total: number;
  page: number;
  limit: number;
}
