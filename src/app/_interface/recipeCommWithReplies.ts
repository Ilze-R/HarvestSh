import { RecipeComment } from './recipecomment';

export interface RecipeCommWithReplies {
  comment: RecipeComment;
  replies: RecipeComment[];
}
