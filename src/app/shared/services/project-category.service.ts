import { EnvService } from '../../env.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PagingParams } from '../heplers/paging.param';
import { PaginatedResult } from '../models/pagination.model';
import { getHeader } from './header';

@Injectable({
    providedIn: 'root'
})
export class ProjectCategoryService {
    baseUrl = this.env.apiUrl + '/api/ProjectCategory/';

    constructor(
        private http: HttpClient,
        private env: EnvService) { }

    getAll() {
        return this.http.get(this.baseUrl, getHeader());
    }

    getAllPaging(params: any) {
        return this.http.post(this.baseUrl + 'getAllPaging', params, getHeader());
    }

    getById(id: any, languageId: string) {
        return this.http.get(this.baseUrl + id, getHeader());
    }

    create(data: any) {
        return this.http.post(this.baseUrl, data, getHeader());
    }

    update(data: any) {
        return this.http.put(this.baseUrl, data, getHeader());
    }

    ChangePosition(data: any[]) {
        return this.http.put(this.baseUrl + 'ChangePosition', data, getHeader());
    }

    delete(id: any) {
        return this.http.delete(this.baseUrl + id, getHeader());
    }
}
