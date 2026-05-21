import { TaskPriority, TaskStatus } from '@prisma/client';
export interface CreateTaskInput {
  title: string;
  description?: string;
  estimateHours?: number;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  sprintId?: string;
  parentTaskId?: string;
  assigneeIds?: string[]; // Array of user IDs to link via TaskAssignee
}

export interface UpdateTaskInput
  extends Partial<Omit<CreateTaskInput, 'assigneeIds'>> {
  assigneeIds?: string[]; // Overwrites current assignees if provided
}

export interface TaskQueryParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  sprintId?: string;
  search?: string;
}
