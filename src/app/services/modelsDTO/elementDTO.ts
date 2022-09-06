export class SortDTO {
    empty: boolean
    sorted: boolean
    unsorted: boolean
}
export class PageableDTO {
    offset: string | number
    pageNumber: string | number
    pageSize: string | number
    paged: boolean
    sort: SortDTO
    unpaged: boolean
}