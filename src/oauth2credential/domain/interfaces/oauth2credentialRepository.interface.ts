import { Oauth2credential } from '../entity/oauth2credential.entity';
import { SearchCriteriaDto } from '@shared/interfaces/search-criteria.dto';
import { PaginateResponseDto } from '@shared/interfaces/paginate-response.dto';

export const OAUTH2CREDENTIAL_REPOSITORY_INTERFACE = 'Oauth2credentialRepositoryInterface';
export interface Oauth2credentialRepositoryInterface {
    create(oauth2credential: Oauth2credential): Promise<Oauth2credential>;

    update(id: number, oauth2credential: Partial<Oauth2credential>): Promise<Oauth2credential>;

    findById(id: number): Promise<Oauth2credential | null>;

    findAll(): Promise<Oauth2credential[]>;

    delete(id: number): Promise<void>;
  
    pagination(criteria: SearchCriteriaDto): Promise<PaginateResponseDto<Oauth2credential>>;

    findByUserIdAndPlatform(userId: number, platform: string): Promise<Oauth2credential | null>;
    
    deleteByUserAndPlatform(userId: number, platform: string): Promise<void>;

    findByUserId(userId: number): Promise<Oauth2credential[]>;
}
