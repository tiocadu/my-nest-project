import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PatchTaskStatusDto } from './dto/patch-task-status.dto';
import { TaskSearchDto } from './dto/search-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(taskFilters: TaskSearchDto): Task[] {
    const { status, search } = taskFilters;
    let tasksFiltered = this.getAllTasks();

    if (status) {
      tasksFiltered = tasksFiltered.filter(task => task.status === status);
    }

    if (search) {
      tasksFiltered = tasksFiltered.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasksFiltered;
  }

  async getTaskById(id: number): Promise<Task> {
    const foundTask = await this.taskRepository.findOne(id);

    if (!foundTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return foundTask;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTaskById(id: number): Promise<void> {
    const deleteResponse = await this.taskRepository.delete(id);

    if (deleteResponse.affected == 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  updateTaskStatus(id: string, patchTaskStatusDto: PatchTaskStatusDto): Task {
    const { status } = patchTaskStatusDto;
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
