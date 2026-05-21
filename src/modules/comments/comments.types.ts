export interface CreateCommentInput {
  content: string;
  parentCommentId?: string; // Set this value to handle replies
}
