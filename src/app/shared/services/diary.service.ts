import { EnvService } from './../../env.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PagingParams } from '../heplers/paging.param';
import { PaginatedResult } from '../models/pagination.model';
import { Diary } from '../models/diary.model';

@Injectable({
    providedIn: 'root'
})
export class DiaryService {
    baseUrl = this.env.apiUrl + '/api/diary/';

    constructor(
        private http: HttpClient,
        private env: EnvService) { }

    getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<Diary[]>> {
        const paginatedResult = new PaginatedResult<Diary[]>();

        let params = new HttpParams();
        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        if (pagingParams != null) {
            params = params.append('keyword', pagingParams.keyword || '');
            params = params.append('sortKey', pagingParams.sortKey || '');
            params = params.append('sortValue', pagingParams.sortValue || '');
            params = params.append('searchKey', pagingParams.searchKey || '');
            params = params.append('searchValue', pagingParams.searchValue || '');
        }

        return this.http.get<Diary[]>(this.baseUrl + 'getAllPaging', { observe: 'response', params })
            .pipe(
                map(response => {
                    paginatedResult.result = response.body;
                    if (response.headers.get('Pagination') != null) {
                        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                    }
                    return paginatedResult;
                })
            );
    }

    getById(id: any) {
        return this.http.get(this.baseUrl + id);
    }

    create(data: Diary) {
        return this.http.post(this.baseUrl, data);
    }
}
