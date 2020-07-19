import { TaskStatus } from '../task-status.enum';
import { IsEnum, IsDefined } from 'class-validator';

export class PatchTaskStatusDto {
  @IsDefined()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
