export interface SearchResult {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  type: SearchResultType;
  path: string;
  relevanceScore?: number;
}

export enum SearchResultType {
  Product = 'product',
  Page = 'page',
  Category = 'category',
  Article = 'article',
  Other = 'other'
}
