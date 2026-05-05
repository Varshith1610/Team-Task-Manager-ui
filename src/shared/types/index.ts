export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];