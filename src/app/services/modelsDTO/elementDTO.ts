/**
 * Classe che contiene gli attributi che indicano il tipo di sorting ritornato dalle api.
 */
export class SortDTO {
    empty: boolean
    sorted: boolean
    unsorted: boolean
}
/**
 * Classe che contiene gli attributi che indicano il tipo di paging ritornato dalle api.
 */
export class PageableDTO {
    offset: string | number
    pageNumber: string | number
    pageSize: string | number
    paged: boolean
    sort: SortDTO
    unpaged: boolean
}