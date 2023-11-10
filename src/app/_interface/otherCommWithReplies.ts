import { OtherComment } from './othercomment';

export interface OtherCommentWithReplies {
  comment: OtherComment;
  replies: OtherComment[];
}
