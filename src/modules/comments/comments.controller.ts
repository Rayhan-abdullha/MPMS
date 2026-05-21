import { Request, Response, NextFunction } from 'express';
import * as commentService from './comments.service';

export const postComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const comment = await commentService.addCommentToTask(
      req.params.taskId,
      req.user!.id,
      req.body,
    );
    res.status(201).json({ status: 'success', data: { comment } });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const comments = await commentService.getTaskCommentsTree(
      req.params.taskId,
    );
    res.status(200).json({ status: 'success', data: { comments } });
  } catch (error) {
    next(error);
  }
};
