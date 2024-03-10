import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProviderAuthentication } from 'src/streamingnotification/domain/entity/providerauthentication.entity';
import { ProviderAuthenticationRepositoryInterface } from 'src/streamingnotification/domain/interfaces/providerauthenticationRepository.interface';

@Injectable()
export class ProviderAuthenticationRepository implements ProviderAuthenticationRepositoryInterface {
    constructor(
        @InjectRepository(ProviderAuthentication)
        private readonly providerAuthenticationRepository: Repository<ProviderAuthentication>,
    ) {}

    async create(providerAuthentication: ProviderAuthentication): Promise<ProviderAuthentication> {
        return this.providerAuthenticationRepository.save(providerAuthentication);
    }
    async update(
        id: number,
        providerAuthentication: Partial<ProviderAuthentication>,
    ): Promise<ProviderAuthentication> {
        await this.providerAuthenticationRepository.update({ id }, providerAuthentication);
        return this.findById(id);
    }

    async findById(id: number): Promise<ProviderAuthentication | null> {
        return this.providerAuthenticationRepository.findOne({
            where: { id },
        });
    }

    async findByName(name: string): Promise<ProviderAuthentication | null> {
        return this.providerAuthenticationRepository.findOne({
            where: { name },
        });
    }
}
