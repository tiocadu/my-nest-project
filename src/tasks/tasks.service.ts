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

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string): Task {
    const taskToBeRemoved = this.getTaskById(id);
    this.tasks = this.tasks.filter(task => task.id !== taskToBeRemoved.id);
    return taskToBeRemoved;
  }

  updateTaskStatus(id: string, patchTaskStatusDto: PatchTaskStatusDto): Task {
    const { status } = patchTaskStatusDto;
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
