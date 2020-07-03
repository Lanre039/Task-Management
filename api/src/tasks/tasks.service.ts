import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksByFiterDto } from './dto/get-tasks-filter-dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ){}
    
    getTasks(getTasksByFilterDto: GetTasksByFiterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(getTasksByFilterDto, user);
       
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        // const data = await this.taskRepository.findOne(id);
        const data = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        
        if (!data) {
            throw new NotFoundException(`Task with ID ${id} NOT found`);
        }
        return data;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }


    async deleteTask(id: number, user: User): Promise<void> {
        // const task = await this.taskRepository.delete(id);
        const task = await this.taskRepository.delete({ id, userId: user.id });
        if( task.affected === 0 ){
            throw new NotFoundException(`Task with ID ${id} NOT found`);
        }
    }

    async updateTask(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        return await task.save();
    }
}
