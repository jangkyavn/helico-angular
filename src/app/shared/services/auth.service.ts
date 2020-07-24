import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { DecodedToken } from '../models/decode-token.model';
import { EnvService } from 'src/app/env.service';
import { SessionConstant } from '../constants/session.constant';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    baseUrl = this.env.apiUrl + '/api/auth/';
    jwtHelper = new JwtHelperService();

    constructor(
        private http: HttpClient,
        private env: EnvService) { }

    login(model: any) {
        return this.http.post(this.baseUrl + 'login', model).pipe(
            map((response: any) => {
                if (response.status) {
                    localStorage.setItem(SessionConstant.TOKEN, response.token);
                    const decodedToken = this.jwtHelper.decodeToken(response.token);
                    localStorage.setItem(SessionConstant.USER, JSON.stringify(decodedToken));
                }
                return { status: response.status, messsage: response.message };
            })
        );
    }

    loggedIn() {
        const token = localStorage.getItem(SessionConstant.TOKEN);
        return !this.jwtHelper.isTokenExpired(token);
    }

    roleMatch(allowedRoles: Array<string>): boolean {
        let isMatch = false;
        const userRoles = this.getUser().role as Array<string>;
        allowedRoles.forEach((element: any) => {
            if (userRoles.includes(element)) {
                isMatch = true;
                return;
            }
        });

        return isMatch;
    }

    getUser(): DecodedToken {
        const userSession = JSON.parse(localStorage.getItem(SessionConstant.USER)) as DecodedToken;
        return userSession;
    }

    setUser(data: DecodedToken): void {
        localStorage.setItem(SessionConstant.USER, JSON.stringify(data));
    }
}
