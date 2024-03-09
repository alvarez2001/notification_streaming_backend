import { Authentication } from '../entity/authentication.entity';

export const AUTHENTICATION_REPOSITORY_INTERFACE = 'AuthenticationRepositoryInterface';

export interface AuthenticationRepositoryInterface {
    create(authentication: Authentication): Promise<Authentication>;

    update(id: number, authentication: Partial<Authentication>): Promise<Authentication>;

    findById(id: number): Promise<Authentication | null>;

    findAll(): Promise<Authentication[]>;

    delete(id: number): Promise<void>;

    findByUserId(userId: number): Promise<Authentication | null>;

    findByToken(token: string): Promise<Authentication>;
}
