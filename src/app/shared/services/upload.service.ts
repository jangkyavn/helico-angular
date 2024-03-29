import { EnvService } from './../../env.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileReponse } from '../models/file-repsonse.model';
import { Observable } from 'rxjs';
import { getHeader } from './header';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    baseUrl = this.env.apiUrl + '/api/upload/';

    constructor(
        private http: HttpClient,
        private env: EnvService) { }

    uploadFile(data: FormData, folderType: string, folderName: string, fileName: string = ''): Observable<FileReponse> {
        data.append('folderType', folderType);
        data.append('folderName', folderName);
        data.append('fileName', fileName);
        return this.http.post(this.baseUrl, data, getHeader());
    }
}
