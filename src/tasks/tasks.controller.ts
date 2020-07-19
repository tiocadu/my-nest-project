import { Controller, Get, Post, Delete, Body, Param, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { PatchTaskStatusDto } from './dto/patch-task-status.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getAlltasks(): Task[] {
        return this.tasksService.getAllTasks();
    }

    @Get(':id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id);
    }

    @Post()
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
        @Body() patchTaskStatusDto: PatchTaskStatusDto
    ): Task {
        return this.tasksService.updateTaskStatus(id, patchTaskStatusDto);
    }
}
