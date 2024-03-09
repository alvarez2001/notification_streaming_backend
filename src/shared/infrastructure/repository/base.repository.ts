import { Repository, SelectQueryBuilder } from 'typeorm';
import { SearchCriteriaDto } from '../../interfaces/search-criteria.dto';
import { PaginateResponseDto } from '../../interfaces/paginate-response.dto';

export abstract class BaseRepository<T> {

    constructor(private readonly repository: Repository<T>) {}

    protected async findByCriteria(criteria: SearchCriteriaDto): Promise<PaginateResponseDto<T>> {
        const { sort, page = 1, limit = 10, ...filters } = criteria;
        const queryBuilder = this.repository.createQueryBuilder('entity');

        this.applyFilters(queryBuilder, filters);
        const sortObject = this.parseSortCriteria(sort);
        for (const [key, order] of Object.entries(sortObject)) {
            queryBuilder.addOrderBy(`entity.${key}`, order);
        }

        const skip = (page - 1) * limit;
        const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            query: filters,
            sort: sortObject,
        };
    }

    protected applyFilters(
        queryBuilder: SelectQueryBuilder<T>,
        filters: { [key: string]: string | string[] | number | number[] },
    ): void {
        Object.keys(filters).forEach(key => {
            const value = filters[key];
            if (key.endsWith('Start')) {
                queryBuilder.andWhere(`entity.${key} >= :startValue`, { startValue: value });
            } else if (key.endsWith('End')) {
                queryBuilder.andWhere(`entity.${key} <= :endValue`, { endValue: value });
            } else {
                queryBuilder.andWhere(`entity.${key} LIKE :value`, { value: `%${value}%` });
            }
        });
    }

    private parseSortCriteria(sort?: string): { [key: string]: 'ASC' | 'DESC' } {
        const sortObject = {};
        if (sort) {
            sort.split(',').forEach(part => {
                const direction = part.startsWith('-') ? 'DESC' : 'ASC';
                const key = part.startsWith('-') ? part.substring(1) : part;
                sortObject[key] = direction;
            });
        }
        return sortObject;
    }
}
