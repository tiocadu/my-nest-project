import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { PatchTaskStatusDto } from './dto/patch-task-status.dto';
import { TaskSearchDto } from './dto/search-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) query: TaskSearchDto): Task[] {
    if (Object.keys(query).length) {
      return this.tasksService.getTasksWithFilter(query);
    }
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: string): Task {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body(ValidationPipe) patchTaskStatusDto: PatchTaskStatusDto,
  ): Task {
    return this.tasksService.updateTaskStatus(id, patchTaskStatusDto);
  }
}
