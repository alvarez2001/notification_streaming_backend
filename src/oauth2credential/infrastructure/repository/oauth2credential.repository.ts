import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Oauth2credentialRepositoryInterface } from '../../domain/interfaces/oauth2credentialRepository.interface';
import { Oauth2credential } from '../../domain/entity/oauth2credential.entity';
import { SearchCriteriaDto } from '@shared/interfaces/search-criteria.dto';
import { PaginateResponseDto } from '@shared/interfaces/paginate-response.dto';
import { BaseRepository } from '@shared/infrastructure/repository/base.repository';

@Injectable()
export class Oauth2credentialRepository extends BaseRepository<Oauth2credential> implements Oauth2credentialRepositoryInterface {
    constructor(
        @InjectRepository(Oauth2credential)
        private readonly oauth2credentialRepository: Repository<Oauth2credential>,
    ) {
        super(oauth2credentialRepository);
    }

    async create(oauth2credential: Oauth2credential): Promise<Oauth2credential> {
        return this.oauth2credentialRepository.save(oauth2credential);
    }

    async findById(id: number): Promise<Oauth2credential | null> {
        return this.oauth2credentialRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Oauth2credential[]> {
        return this.oauth2credentialRepository.find();
    }

    async update(id: number, oauth2credential: Partial<Oauth2credential>): Promise<Oauth2credential> {
        await this.oauth2credentialRepository.update({ id }, oauth2credential);
        return this.findById(id);
    }

    async delete(id: number): Promise<void> {
        await this.oauth2credentialRepository.delete(id);
    }

    async pagination(criteria: SearchCriteriaDto): Promise<PaginateResponseDto<Oauth2credential>> {
        return this.findByCriteria(criteria);
    }

    async findByUserIdAndPlatform(userId: number, platform: string) {
        return this.oauth2credentialRepository.findOneBy({
            user: {
                id: userId,
            },
            platform,
        });
    }

    async deleteByUserAndPlatform(userId: number, platform: string): Promise<void> {
        await this.oauth2credentialRepository.delete({
            userId,
            platform,
        });
    }

    async findByUserId(userId: number): Promise<Oauth2credential[]> {
        return this.oauth2credentialRepository.find({
            where: {
                userId
            }
        });
    }
}
