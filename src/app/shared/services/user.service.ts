import { EnvService } from './../../env.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PagingParams } from '../heplers/paging.param';
import { PaginatedResult } from '../models/pagination.model';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    baseUrl = this.env.apiUrl + '/api/user/';

    constructor(
        private http: HttpClient,
        private env: EnvService) { }

    getAll() {
        return this.http.get(this.baseUrl);
    }

    getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<User[]>> {
        const paginatedResult = new PaginatedResult<User[]>();

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

        return this.http.get<User[]>(this.baseUrl + 'getAllPaging', { observe: 'response', params })
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

    getGenders() {
        return this.http.get(this.baseUrl + 'GetGenders');
    }

    checkCurrentPassword(password: string) {
        return this.http.get(this.baseUrl + 'checkCurrentPassword/' + password);
    }

    create(data: User) {
        return this.http.post(this.baseUrl, data);
    }

    update(data: User) {
        return this.http.put(this.baseUrl, data);
    }

    updateAvatar(data: User) {
        return this.http.put(this.baseUrl + 'UpdateAvatar', data);
    }

    changeStatus(data: any) {
        return this.http.put(this.baseUrl + 'changeStatus', data);
    }

    changePassword(data: any) {
        return this.http.put(this.baseUrl + 'changePassword', data);
    }

    resetPassword(data: any) {
        return this.http.put(this.baseUrl + 'resetPassword', data);
    }

    delete(id: any) {
        return this.http.delete(this.baseUrl + id);
    }
}
