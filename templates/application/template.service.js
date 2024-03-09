module.exports = (
    entityNameLowerCase,
    entityNameCamelCase,
) => `import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
    ${entityNameCamelCase.toUpperCase()}_REPOSITORY_INTERFACE,
    ${entityNameCamelCase}RepositoryInterface,
} from '../domain/interfaces/${entityNameLowerCase}Repository.interface';
import { ${entityNameCamelCase} } from '../domain/entity/${entityNameLowerCase}.entity';
import { Create${entityNameCamelCase}Dto } from '../interfaces/api/dto/create-${entityNameLowerCase}.dto';
import { Update${entityNameCamelCase}Dto } from '../interfaces/api/dto/update-${entityNameLowerCase}.dto';
import { ${entityNameCamelCase}ResponseDto } from '../interfaces/api/dto/${entityNameLowerCase}-response.dto';
import { plainToClass } from 'class-transformer';
import * as bcryptjs from 'bcryptjs';
import { SearchCriteriaDto } from '@shared/interfaces/search-criteria.dto';
import { PaginateResponseDto } from '@shared/interfaces/paginate-response.dto';

@Injectable()
export class ${entityNameCamelCase}Service {
    constructor(
        @Inject(${entityNameCamelCase.toUpperCase()}_REPOSITORY_INTERFACE)
        private ${entityNameLowerCase}Repository: ${entityNameCamelCase}RepositoryInterface,
    ) {}

    async create${entityNameCamelCase}(create${entityNameCamelCase}Dto: Create${entityNameCamelCase}Dto): Promise<${entityNameCamelCase}ResponseDto> {
        const ${entityNameLowerCase} = new ${entityNameCamelCase}();
        Object.assign(${entityNameLowerCase}, create${entityNameCamelCase}Dto);
        await this.${entityNameLowerCase}Repository.create(${entityNameLowerCase});
        return plainToClass(${entityNameCamelCase}ResponseDto, ${entityNameLowerCase}, {
            excludeExtraneousValues: true,
        });
    }

    async update${entityNameCamelCase}(id: number, update${entityNameCamelCase}Dto: Update${entityNameCamelCase}Dto): Promise<${entityNameCamelCase}ResponseDto> {
        const ${entityNameLowerCase} = await this.${entityNameLowerCase}Repository.findById(id);
        if (!${entityNameLowerCase}) {
            throw new Error('${entityNameCamelCase} not found');
        }
        Object.assign(${entityNameLowerCase}, update${entityNameCamelCase}Dto);

        await this.${entityNameLowerCase}Repository.update(id, ${entityNameLowerCase});
        return plainToClass(${entityNameCamelCase}ResponseDto, ${entityNameLowerCase}, {
            excludeExtraneousValues: true,
        });
    }

    async find${entityNameCamelCase}ById(id: number): Promise<${entityNameCamelCase}ResponseDto> {
        const ${entityNameLowerCase} = await this.${entityNameLowerCase}Repository.findById(id);

        return plainToClass(${entityNameCamelCase}ResponseDto, ${entityNameLowerCase}, {
            excludeExtraneousValues: true,
        });
    }

    async findAll${entityNameCamelCase}s(): Promise<${entityNameCamelCase}ResponseDto[]> {
        const ${entityNameLowerCase}s = await this.${entityNameLowerCase}Repository.findAll();
        return ${entityNameLowerCase}s.map(${entityNameLowerCase} =>
            plainToClass(${entityNameCamelCase}ResponseDto, ${entityNameLowerCase}, {
                excludeExtraneousValues: true,
            }),
        );
    }

    async delete${entityNameCamelCase}(id: number): Promise<void> {
        return this.${entityNameLowerCase}Repository.delete(id);
    }

    async pagination(criteria: SearchCriteriaDto): Promise<PaginateResponseDto<${entityNameCamelCase}ResponseDto>> {
        const pagination: PaginateResponseDto<${entityNameCamelCase}> =
            await this.${entityNameLowerCase}Repository.pagination(criteria);

        const paginationResponse: PaginateResponseDto<${entityNameCamelCase}ResponseDto> = {
            ...pagination,
            data: [],
        };

        paginationResponse.data = pagination.data.map((${entityNameLowerCase}: ${entityNameCamelCase}) => {
            return plainToClass(${entityNameCamelCase}ResponseDto, ${entityNameLowerCase}, {
                excludeExtraneousValues: true,
            });
        });

        return paginationResponse;
    }
}
`;
