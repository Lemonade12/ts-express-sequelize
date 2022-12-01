export interface UpdateInfoDTO {
  content?: string;
  is_deleted?: boolean;
  hit?: number;
}

export interface CreateInfoDTO {
  title: string;
  content: string;
  hashtags: string;
}

export interface ListCondition {
  search?: string;
  orderBy?: string;
  order?: string;
  hastags?: string;
  page?: number;
  limit?: number;
}

export interface topHitListDTO {
  id: number;
  hit: number;
}
