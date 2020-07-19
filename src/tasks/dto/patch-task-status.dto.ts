import { TaskStatus } from '../task.model';
import { IsEnum, IsDefined } from 'class-validator';

export class PatchTaskStatusDto {
  @IsDefined()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
