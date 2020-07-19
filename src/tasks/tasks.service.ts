import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { PatchTaskStatusDto } from './dto/patch-task-status.dto';
import { TaskSearchDto } from './dto/search-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 'b81546ef-e0f0-4553-9218-957bd548c023',
      title: 'First Task',
      description: 'Long description',
      status: TaskStatus.OPEN,
    },
    {
      id: 'd7b41a7e-d6ca-41e4-af7b-abd392bd6a97',
      title: 'Second Task',
      description: 'Long description - solve puzzle',
      status: TaskStatus.OPEN,
    },
    {
      id: '03e868fd-7cd8-4d52-bfe8-6da1a2ad0cd2',
      title: 'Third Task',
      description: 'Long description - write puzzle',
      status: TaskStatus.OPEN,
    },
  ];

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

  getTaskById(id: string): Task {
    const foundTask = this.tasks.find(task => task.id === id);

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
    const taskToBeRemoved = this.tasks.find(task => task.id === id);
    this.tasks = this.tasks.filter(task => task.id !== id);
    return taskToBeRemoved;
  }

  updateTaskStatus(id: string, patchTaskStatusDto: PatchTaskStatusDto): Task {
    const { status } = patchTaskStatusDto;
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
