import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PatchTaskStatusDto } from './dto/patch-task-status.dto';
import { TaskSearchDto } from './dto/search-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: TaskSearchDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const foundTask = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!foundTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return foundTask;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: number): Promise<void> {
    const deleteResponse = await this.taskRepository.delete(id);

    if (deleteResponse.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateTaskStatus(
    id: number,
    patchTaskStatusDto: PatchTaskStatusDto,
    user: User,
  ): Promise<Task> {
    const { status } = patchTaskStatusDto;
    const task = await this.getTaskById(id, user);
    task.status = status;
    task.save();

    return task;
  }
}
