import { EnvService } from './../../env.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { getHeader } from './header';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    baseUrl = this.env.apiUrl + '/api/file/';

    constructor(
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private env: EnvService) { }

    getFile(data: any): Observable<any> {
        return this.http.get(this.baseUrl + 'GetFile?path=' + data, { responseType: 'blob', ...getHeader() })
            .pipe(
                map((res: Blob) => {
                    const objectURL = URL.createObjectURL(res);
                    const result = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                    return result;
                })
            );
    }
}
