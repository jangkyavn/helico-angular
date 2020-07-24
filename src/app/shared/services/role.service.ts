import { EnvService } from './../../env.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PagingParams } from '../heplers/paging.param';
import { PaginatedResult } from '../models/pagination.model';
import { Role } from '../models/role.model';

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    baseUrl = this.env.apiUrl + '/api/role/';

    constructor(
        private http: HttpClient,
        private env: EnvService) { }

    getAll() {
        return this.http.get(this.baseUrl);
    }

    getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<Role[]>> {
        const paginatedResult = new PaginatedResult<Role[]>();

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

        return this.http.get<Role[]>(this.baseUrl + 'getAllPaging', { observe: 'response', params })
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

    create(data: Role) {
        return this.http.post(this.baseUrl, data);
    }

    update(data: Role) {
        return this.http.put(this.baseUrl, data);
    }

    ChangePosition(data: any[]) {
        return this.http.put(this.baseUrl + 'ChangePosition', data);
    }

    delete(id: any) {
        return this.http.delete(this.baseUrl + id);
    }
}
