export class PaginateResponseDto<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
    query: object;
    sort: object;
}
