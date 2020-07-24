export class PagingParams {
    pageNumber?: number;
    pageSize?: number;
    keyword?: string;
    sortValue?: string;
    sortKey?: string;
    searchKey?: string;
    searchValue?: string;

    constructor(
        pageNumber: number,
        pageSize: number,
        keyword: string,
        sortValue: string,
        sortKey: string,
        searchKey: string,
        searchValue: string) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.keyword = keyword;
        this.sortValue = sortValue;
        this.sortKey = sortKey;
        this.searchKey = searchKey;
        this.searchValue = searchValue;
    }
}
