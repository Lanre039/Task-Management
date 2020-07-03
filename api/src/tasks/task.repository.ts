import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task-dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksByFiterDto } from "./dto/get-tasks-filter-dto";
import { User } from "src/auth/user.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('TaskRepository');
    async getTasks(getTasksByFilterDto: GetTasksByFiterDto, user: User): Promise<Task[]> {
        const { search, status } = getTasksByFilterDto;

        const query = this.createQueryBuilder('task');

        query.andWhere('task.userId = :userId', { userId: user.id });

        if (status) {
            // Look for exact match
            query.andWhere('task.status = :status', { status }); 
        }

        if (search) {
             // Look for partial match with the two criteria
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }

        try {
            const result = await query.getMany();
            return result;
        } catch (error) {
            this.logger.error(`Failed to get tasks for user "${user.username}". Filter: ${JSON.stringify(getTasksByFilterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }

    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user= user;

        try {
            await task.save();
        } catch (error) {
            this.logger.error(`Failed to create a task for user "${user.username}". Filter: ${JSON.stringify(createTaskDto)}`, error.stack);
            throw new InternalServerErrorException();
        }


        delete task.user;
        return task;
    }
}