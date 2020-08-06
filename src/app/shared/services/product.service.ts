import { EnvService } from '../../env.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PagingParams } from '../heplers/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    baseUrl = this.env.apiUrl + '/api/Product/';

    constructor(
        private http: HttpClient,
        private env: EnvService) { }

    getAll() {
        return this.http.get(this.baseUrl);
    }

    getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<any[]>> {
        const paginatedResult = new PaginatedResult<any[]>();

        let params = new HttpParams();
        params = params.append('pageNumber', page);
        params = params.append('pageSize', itemsPerPage);
        params = params.append('keyword', pagingParams.keyword || '');
        params = params.append('sortKey', pagingParams.sortKey || '');
        params = params.append('sortValue', pagingParams.sortValue || '');
        params = params.append('searchKey', pagingParams.searchKey || '');
        params = params.append('searchValue', pagingParams.searchValue || '');
        params = params.append('languageId', pagingParams.languageId || '');

        return this.http.get<any[]>(this.baseUrl + 'getAllPaging', { observe: 'response', params })
            .pipe(
                map(response => {
                    paginatedResult.result = Object.assign([], response.body);
                    paginatedResult.result.forEach((item: any, index: any) => {
                        item.stt = itemsPerPage * (page - 1) + (index + 1);
                    });

                    if (response.headers.get('Pagination') != null) {
                        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                    }
                    return paginatedResult;
                })
            );
    }

    getById(id: any, languageId: string) {
        return this.http.get(this.baseUrl + id + '/' + languageId);
    }

    create(data: any) {
        return this.http.post(this.baseUrl, data);
    }

    update(data: any) {
        return this.http.put(this.baseUrl, data);
    }

    delete(id: any) {
        return this.http.delete(this.baseUrl + id);
    }
}
