export interface GardeningComment {
  id: number;
  date: string;
  comment_text: string;
  reply_username: string;
  likes: number;
  parent_comment_id: number;
  comment_user_id: number;
  user_image_url: string;
  username: string;
}
