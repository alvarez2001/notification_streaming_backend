import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
    USER_REPOSITORY_INTERFACE,
    UserRepositoryInterface,
} from '../domain/interfaces/userRepository.interface';
import { User } from '../domain/entity/user.entity';
import { CreateUserDto } from '../interfaces/api/dto/create-user.dto';
import { UpdateUserDto } from '../interfaces/api/dto/update-user.dto';
import { UserResponseDto } from '../interfaces/api/dto/user-response.dto';
import { plainToClass } from 'class-transformer';
import * as bcryptjs from 'bcryptjs';
import { SearchCriteriaDto } from '@shared/interfaces/search-criteria.dto';
import { PaginateResponseDto } from '@shared/interfaces/paginate-response.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY_INTERFACE)
        private userRepository: UserRepositoryInterface,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const existUser = await this.findByUsername(createUserDto.username);
        if (existUser) {
            throw new BadRequestException({
                message: 'User already exists',
                statusCode: 400,
            });
        }

        const user = new User();
        Object.assign(user, createUserDto);

        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(user.password, salt);

        await this.userRepository.create(user);
        return plainToClass(UserResponseDto, user, {
            excludeExtraneousValues: true,
        });
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        Object.assign(user, updateUserDto);

        if (updateUserDto.password) {
            const salt = bcryptjs.genSaltSync();
            user.password = bcryptjs.hashSync(updateUserDto.password, salt);
        }

        await this.userRepository.update(id, user);
        return plainToClass(UserResponseDto, user, {
            excludeExtraneousValues: true,
        });
    }

    async findUserById(id: number): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);

        return plainToClass(UserResponseDto, user, {
            excludeExtraneousValues: true,
        });
    }

    async findAllUsers(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.findAll();
        return users.map(user =>
            plainToClass(UserResponseDto, user, {
                excludeExtraneousValues: true,
            }),
        );
    }

    async deleteUser(id: number): Promise<void> {
        return this.userRepository.delete(id);
    }

    async findByUsername(username: string): Promise<User | null> {
        return await this.userRepository.findByUsername(username);
    }

    async pagination(criteria: SearchCriteriaDto): Promise<PaginateResponseDto<UserResponseDto>> {
        const pagination: PaginateResponseDto<User> =
            await this.userRepository.pagination(criteria);

        const paginationResponse: PaginateResponseDto<UserResponseDto> = {
            ...pagination,
            data: [],
        };

        paginationResponse.data = pagination.data.map((user: User) => {
            return plainToClass(UserResponseDto, user, {
                excludeExtraneousValues: true,
            });
        });

        return paginationResponse;
    }
}
