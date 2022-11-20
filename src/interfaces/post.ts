export interface UpdateInfoDTO {
  content: string;
  is_deleted?: boolean;
}

export interface CreateInfoDTO {
  title: string;
  content: string;
  hashtags: string;
}
