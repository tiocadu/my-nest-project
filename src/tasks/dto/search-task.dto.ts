import { TaskStatus } from '../task.model';

export class TaskSearchDto {
  status: TaskStatus;
  search: string;
}
