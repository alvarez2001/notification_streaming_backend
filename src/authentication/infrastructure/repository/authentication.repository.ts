import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticationRepositoryInterface } from '../../domain/interfaces/authenticationRepository.interface';
import { Authentication } from '../../domain/entity/authentication.entity';

@Injectable()
export class AuthenticationRepository implements AuthenticationRepositoryInterface {
    constructor(
        @InjectRepository(Authentication)
        private readonly authenticationRepository: Repository<Authentication>,
    ) {}

    async create(authentication: Authentication): Promise<Authentication> {
        return this.authenticationRepository.save(authentication);
    }

    async findById(id: number): Promise<Authentication | null> {
        return this.authenticationRepository.findOne({
            where: { id },
            relations: {
                user: true,
            },
        });
    }

    async findAll(): Promise<Authentication[]> {
        return this.authenticationRepository.find();
    }

    async update(id: number, authentication: Partial<Authentication>): Promise<Authentication> {
        await this.authenticationRepository.update({ id }, authentication);
        return this.findById(id);
    }

    async delete(id: number): Promise<void> {
        await this.authenticationRepository.delete(id);
    }

    async findByUserId(userId: number): Promise<Authentication | null> {
        return this.authenticationRepository.findOne({
            where: { user: { id: userId } },
        });
    }

    async findByToken(token: string): Promise<Authentication> {
        return await this.authenticationRepository.findOne({ where: { token } });
    }
}
