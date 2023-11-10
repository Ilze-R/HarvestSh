import { GardeningComment } from './gardeningcomment';

export interface GardeningCommentWithReplies {
  comment: GardeningComment;
  replies: GardeningComment[];
}
