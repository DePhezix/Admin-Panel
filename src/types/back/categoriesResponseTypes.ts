export interface categoryType {
  id: string;
  name: string;
  active: boolean;
}

export interface categoriesResponseType {
  data: categoryType[];
  total: number;
  page: number;
  limit: number;
}
