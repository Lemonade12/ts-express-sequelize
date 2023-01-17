export interface UpdateInfoDTO {
  content?: string;
  is_deleted?: boolean;
  hit?: number;
}

export interface CreateInfoDTO {
  title: string;
  content: string;
  hashtags?: string;
}

export interface ListCondition {
  search?: string;
  orderBy?: string;
  order?: string;
  hastags?: string;
  page?: number;
  limit?: number;
}

export interface hitListDTO {
  value: string;
  score: number;
}

export interface hitRankListDTO {
  ranking: number;
  postId: number;
  hit: number;
}

export interface redisSortedSet {
  score: number;
  value: string;
}
