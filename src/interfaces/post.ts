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
