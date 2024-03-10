import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StreamingNotificationRepositoryInterface } from '../../domain/interfaces/streamingnotificationRepository.interface';
import { StreamingNotification } from '../../domain/entity/streamingnotification.entity';
import { SearchCriteriaDto } from '@shared/interfaces/search-criteria.dto';
import { PaginateResponseDto } from '@shared/interfaces/paginate-response.dto';
import { BaseRepository } from '@shared/infrastructure/repository/base.repository';

@Injectable()
export class StreamingNotificationRepository
    extends BaseRepository<StreamingNotification>
    implements StreamingNotificationRepositoryInterface
{
    constructor(
        @InjectRepository(StreamingNotification)
        private readonly streamingnotificationRepository: Repository<StreamingNotification>,
    ) {
        super(streamingnotificationRepository);
    }

    async create(streamingnotification: StreamingNotification): Promise<StreamingNotification> {
        return this.streamingnotificationRepository.save(streamingnotification);
    }

    async findById(id: number): Promise<StreamingNotification | null> {
        return this.streamingnotificationRepository.findOne({
            where: { id },
            relations: {
                platformNotifications: true,
            },
        });
    }

    async findAll(userId: number): Promise<StreamingNotification[]> {
        return this.streamingnotificationRepository.find({
            where: { userId },
            relations: {
                platformNotifications: true,
            },
        });
    }

    async update(
        id: number,
        streamingnotification: Partial<StreamingNotification>,
    ): Promise<StreamingNotification> {
        const byId = await this.findById(id);

        if (!byId) {
            throw new NotFoundException(`streaming notification id ${id} no found`);
        }

        for (const [key, value] of Object.entries(streamingnotification)) {
            byId[key] = value;
        }

        await this.streamingnotificationRepository.save(byId);
        return byId;
    }

    async delete(id: number): Promise<void> {
        await this.streamingnotificationRepository.delete(id);
    }

    async pagination(
        criteria: SearchCriteriaDto,
    ): Promise<PaginateResponseDto<StreamingNotification>> {
        return this.findByCriteria(criteria);
    }

    async findByUsername(name: string): Promise<StreamingNotification | null> {
        return this.streamingnotificationRepository.findOne({
            where: { name },
            relations: {
                platformNotifications: true,
            },
        });
    }

    async findBySubscriptionId(id: string): Promise<StreamingNotification | null> {
        return this.streamingnotificationRepository.findOne({
            where: { subscriptionId: id },
            relations: {
                platformNotifications: true,
            },
        });
    }
}
