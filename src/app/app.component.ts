import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OnlineStatusType, OnlineStatusService } from 'ngx-online-status';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from './shared/services/auth.service';
import { SessionConstant } from './shared/constants/session.constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  jwtHelper = new JwtHelperService();
  userRoles: any[] = [];
  status: OnlineStatusType;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private onlineStatusService: OnlineStatusService,
    private authService: AuthService) { }

  ngOnInit() {
    const token = localStorage.getItem(SessionConstant.TOKEN);

    if (token) {
      this.userRoles = this.authService.getUser().role as Array<string>;
      if (!this.userRoles) {
        this.router.navigate(['/dang-nhap'], { queryParams: { returnUrl: this.router.url } });
      }
    }

    if (navigator.onLine) {
      this.spinner.hide();
    } else {
      this.spinner.show();
    }

    this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {
      if (status === OnlineStatusType.ONLINE) {
        this.spinner.hide();
      } else {
        this.spinner.show();
      }
    });
  }
}
