export type WithoutInlineData = {
  id: string;
};

export type SearchResponse<T = WithoutInlineData> = {
  data: T[];
  meta: {
    resultCount: number;
  };
};
