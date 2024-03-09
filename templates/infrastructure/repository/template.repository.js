module.exports = (
    entityNameLowerCase,
    entityNameCamelCase,
) => `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${entityNameCamelCase}RepositoryInterface } from '../../domain/interfaces/${entityNameLowerCase}Repository.interface';
import { ${entityNameCamelCase} } from '../../domain/entity/${entityNameLowerCase}.entity';
import { SearchCriteriaDto } from '@shared/interfaces/search-criteria.dto';
import { PaginateResponseDto } from '@shared/interfaces/paginate-response.dto';
import { BaseRepository } from '@shared/infrastructure/repository/base.repository';

@Injectable()
export class ${entityNameCamelCase}Repository extends BaseRepository<${entityNameCamelCase}> implements ${entityNameCamelCase}RepositoryInterface {
    constructor(
        @InjectRepository(${entityNameCamelCase})
        private readonly ${entityNameLowerCase}Repository: Repository<${entityNameCamelCase}>,
    ) {
        super(${entityNameLowerCase}Repository);
    }

    async create(${entityNameLowerCase}: ${entityNameCamelCase}): Promise<${entityNameCamelCase}> {
        return this.${entityNameLowerCase}Repository.save(${entityNameLowerCase});
    }

    async findById(id: number): Promise<${entityNameCamelCase} | null> {
        return this.${entityNameLowerCase}Repository.findOne({ where: { id } });
    }

    async findAll(): Promise<${entityNameCamelCase}[]> {
        return this.${entityNameLowerCase}Repository.find();
    }

    async update(id: number, ${entityNameLowerCase}: Partial<${entityNameCamelCase}>): Promise<${entityNameCamelCase}> {
        await this.${entityNameLowerCase}Repository.update({ id }, ${entityNameLowerCase});
        return this.findById(id);
    }

    async delete(id: number): Promise<void> {
        await this.${entityNameLowerCase}Repository.delete(id);
    }

    async pagination(criteria: SearchCriteriaDto): Promise<PaginateResponseDto<${entityNameCamelCase}>> {
        return this.findByCriteria(criteria);
    }
}
`;
