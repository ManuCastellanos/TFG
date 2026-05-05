import type { Task, TaskStatus } from './Task';

export default interface ITaskRepository {
  getTaskByCmid(token: string, courseId: number, cmid: number, modName: string): Promise<Task | null>;
  getSubmissionStatus(token: string, assignId: number, userId: number): Promise<TaskStatus>;
  viewAssign(token: string, assignId: number): Promise<void>;
}
