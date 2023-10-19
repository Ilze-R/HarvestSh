export interface RecipeComment {
  id: number;
  date: string;
  comment_text: string;
  likes: number;
  parent_comment_id: number;
  comment_user_id: number;
  user_image_url: string;
  username: string;
}
