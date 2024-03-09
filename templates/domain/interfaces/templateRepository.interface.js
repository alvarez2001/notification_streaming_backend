module.exports = (
  entityNameLowerCase,
  entityNameCamelCase,
) => `import { ${entityNameCamelCase} } from '../entity/${entityNameLowerCase}.entity';
import { SearchCriteriaDto } from '@shared/interfaces/search-criteria.dto';
import { PaginateResponseDto } from '@shared/interfaces/paginate-response.dto';

export const ${entityNameCamelCase.toUpperCase()}_REPOSITORY_INTERFACE = '${entityNameCamelCase}RepositoryInterface';
export interface ${entityNameCamelCase}RepositoryInterface {
    create(${entityNameLowerCase}: ${entityNameCamelCase}): Promise<${entityNameCamelCase}>;

    update(id: number, ${entityNameLowerCase}: Partial<${entityNameCamelCase}>): Promise<${entityNameCamelCase}>;

    findById(id: number): Promise<${entityNameCamelCase} | null>;

    findAll(): Promise<${entityNameCamelCase}[]>;

    delete(id: number): Promise<void>;
  
    pagination(criteria: SearchCriteriaDto): Promise<PaginateResponseDto<${entityNameCamelCase}>>;

}
`;
