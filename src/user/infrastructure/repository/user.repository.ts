import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryInterface } from '../../domain/interfaces/userRepository.interface';
import { User } from '../../domain/entity/user.entity';
import { SearchCriteriaDto } from '@shared/interfaces/search-criteria.dto';
import { PaginateResponseDto } from '@shared/interfaces/paginate-response.dto';
import { BaseRepository } from '@shared/infrastructure/repository/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> implements UserRepositoryInterface {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super(userRepository);
    }

    async create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async update(id: number, user: Partial<User>): Promise<User> {
        await this.userRepository.update({ id }, user);
        return this.findById(id);
    }

    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { username } });
    }

    async pagination(criteria: SearchCriteriaDto): Promise<PaginateResponseDto<User>> {
        return this.findByCriteria(criteria);
    }
}
