export interface sessionType {
  id: string;
  worker: {
    id: string;
    name: string;
    surname: string;
  };
  agent: {
    id: string;
    name: string;
    surname: string;
  };
  activity: {
    id: string;
    name: string;
  };
  org_id: string;
  equipment_id: string;
  active: boolean;
  created_at: Date;
}

export interface sessionsResponseType {
  data: sessionType[];
  total: number;
  page: number;
  limit: number;
}
