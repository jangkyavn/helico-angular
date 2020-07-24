import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { MessageConstant } from '../constants/message.constant';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private messageService: MessageService) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const roles = next.firstChild.data['roles'] as Array<string>;
        if (roles) {
            const match = this.authService.roleMatch(roles);
            if (match) {
                return true;
            } else {
                this.messageService.error(MessageConstant.FORBIDDEN);
            }
        }

        if (this.authService.getUser()) {
            const userRoles = this.authService.getUser().role as Array<string>;
            if (!userRoles) {
                this.messageService.error(MessageConstant.FORBIDDEN);
                this.router.navigate(['/dang-nhap'], { queryParams: { returnUrl: state.url } });
                return false;
            }
        }

        if (this.authService.loggedIn()) {
            return true;
        }

        this.messageService.error(MessageConstant.LOGIN_AGAIN_MSG);
        this.router.navigate(['/dang-nhap'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
