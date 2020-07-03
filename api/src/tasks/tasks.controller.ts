import { Controller, Get, Body, Post, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksByFiterDto } from './dto/get-tasks-filter-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation-pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetUser } from 'src/auth/get-user-decorator';
import { User } from 'src/auth/user.entity';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskService: TasksService) {}
    private logger = new Logger('TasksController');

    @Get()
    getTasks(
        @Query(ValidationPipe) getTaskByFilterDto: GetTasksByFiterDto,
        @GetUser() user: User
        ): Promise<Task[]> {
            this.logger.verbose(`User "${user.username}" is retrieving all tasks. Filters: ${JSON.stringify(getTaskByFilterDto)}`);
            return this.taskService.getTasks(getTaskByFilterDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
        ): Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }
    
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
        ): Promise<Task> {
            this.logger.verbose(`User "${user.username}" is creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
        return this.taskService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
        ): Promise<void> {
        return this.taskService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTask(
        @Param('id', ParseIntPipe) id: number, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
        ): Promise<Task> {
        return this.taskService.updateTask(id, status, user);
    }

}
