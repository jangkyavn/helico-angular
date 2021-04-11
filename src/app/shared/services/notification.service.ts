import { EnvService } from './../../env.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../models/pagination.model';
import { Notification } from '../models/notification.model';
import { getHeader } from './header';

@Injectable({
    providedIn: 'root'
})
export class NotifycationService {
    baseUrl = this.env.apiUrl + '/api/notification/';

    constructor(
        private http: HttpClient,
        private env: EnvService) { }

    getAllPaging(page?: any, itemsPerPage?: any): Observable<PaginatedResult<Notification[]>> {
        const paginatedResult = new PaginatedResult<Notification[]>();

        let params = new HttpParams();
        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        return this.http.get<Notification[]>(this.baseUrl + 'getAllPaging', { observe: 'response', params, ...getHeader() })
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

    getCountUnView() {
        return this.http.get(this.baseUrl + 'getCountUnView', getHeader());
    }

    markViewedAll() {
        return this.http.put(this.baseUrl + 'markViewedAll', null, getHeader());
    }

    markSeendNotification(data: any) {
        return this.http.put(this.baseUrl + 'MarkSeen', data, getHeader());
    }

    deleteAll() {
        return this.http.delete(this.baseUrl + 'deleteAll', getHeader());
    }
}
