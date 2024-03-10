import { ProviderAuthentication } from '../entity/providerauthentication.entity';

export const PROVIDER_AUTHENTICATION_REPOSITORY_INTERFACE =
    'ProviderAuthenticationRepositoryInterface';

export interface ProviderAuthenticationRepositoryInterface {
    create(providerAuthentication: ProviderAuthentication): Promise<ProviderAuthentication>;

    update(
        id: number,
        providerAuthentication: Partial<ProviderAuthentication>,
    ): Promise<ProviderAuthentication>;

    findByName(name: string): Promise<ProviderAuthentication | null>;

    findById(id: number): Promise<ProviderAuthentication | null>;
}
