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

export interface fileInfoDTO {
  post_id: number;
  user_id: number;
  origin_file_nm: string;
  save_file_nm: string;
  file_extension: string;
  file_size: number;
}

export interface commentInfoDTO {
  postId: number;
  userId: number;
  content: string;
}

export interface alarmInfoDTO {
  userId: number;
  commentId: number;
}
