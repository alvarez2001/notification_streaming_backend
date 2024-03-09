import { SearchCriteriaDto } from '@shared/interfaces/search-criteria.dto';
import { User } from '../entity/user.entity';
import { PaginateResponseDto } from '@shared/interfaces/paginate-response.dto';
import { UserResponseDto } from 'src/user/interfaces/api/dto/user-response.dto';

export const USER_REPOSITORY_INTERFACE = 'UserRepositoryInterface';
export interface UserRepositoryInterface {
    create(user: User): Promise<User>;

    update(id: number, user: Partial<User>): Promise<User>;

    findById(id: number): Promise<User | null>;

    findAll(): Promise<User[]>;

    delete(id: number): Promise<void>;

    findByUsername(username: string): Promise<User | null>;

    pagination(criteria: SearchCriteriaDto): Promise<PaginateResponseDto<User>>;
}
