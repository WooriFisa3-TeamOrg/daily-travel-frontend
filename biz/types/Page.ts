export interface Pageable {
    pageNumber: number;
    pageSize: number;
    offset: number;
    sort: Sort;
}

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}
