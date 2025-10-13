declare interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

declare interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

declare interface Params {
  query?: string;
  page?: number;
  limit?: number;
  userId?: string;
}
