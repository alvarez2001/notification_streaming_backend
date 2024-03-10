import { StreamingNotification } from '../entity/streamingnotification.entity';
import { SearchCriteriaDto } from '@shared/interfaces/search-criteria.dto';
import { PaginateResponseDto } from '@shared/interfaces/paginate-response.dto';

export const STREAMINGNOTIFICATION_REPOSITORY_INTERFACE = 'StreamingNotificationRepositoryInterface';
export interface StreamingNotificationRepositoryInterface {
    create(streamingnotification: StreamingNotification): Promise<StreamingNotification>;

    update(id: number, streamingnotification: Partial<StreamingNotification>): Promise<StreamingNotification>;

    findById(id: number): Promise<StreamingNotification | null>;

    findAll(userId:number): Promise<StreamingNotification[]>;

    delete(id: number): Promise<void>;
  
    pagination(criteria: SearchCriteriaDto): Promise<PaginateResponseDto<StreamingNotification>>;

    findByUsername(name: string): Promise<StreamingNotification | null>;

    findBySubscriptionId(id: string): Promise<StreamingNotification | null>;

}
