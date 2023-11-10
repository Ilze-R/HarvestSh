import { IMadeComment } from './imadecomment';

export interface IMadeCommWithReplies {
  comment: IMadeComment;
  replies: IMadeComment[];
}
