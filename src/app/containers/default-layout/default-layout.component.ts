import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SessionConstant } from 'src/app/shared/constants/session.constant';
import { NotificationResponse } from 'src/app/shared/models/notification-response.model';
import { DiaryService } from 'src/app/shared/services/diary.service';
import { FileService } from 'src/app/shared/services/file.service';
import { SystemConstant } from 'src/app/shared/constants/system.constant';
import { DataService } from 'src/app/shared/services/data.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  @ViewChild('notificationTemplate', { static: false }) template: TemplateRef<{}>;
  isCollapsed = false;
  loadingRoute = false;
  widthOfSidebar = 240;
  avatar: string;
  openMap = {
    sub1: false,
    sub2: false,
    sub3: false,
    sub4: false
  };

  constructor(
    private router: Router,
    private nzNotificationService: NzNotificationService,
    public authService: AuthService,
    private fileService: FileService,
    private dataService: DataService
  ) { }

  createNotification(data: NotificationResponse): void {
    this.nzNotificationService.template(
      this.template,
      {
        nzData: data,
        nzStyle: {
          width: '400px',
          borderLeft: '10px solid green',
        },
        nzPlacement: 'bottomLeft'
      });
  }

  ngOnInit() {
    this.getAvatar();

    this.dataService.updateAvatar$.subscribe((res: boolean) => {
      if (res) {
        this.getAvatar();
      }
    });

    this.router.events.subscribe((event: any) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loadingRoute = true;
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loadingRoute = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  clickToggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    localStorage.removeItem(SessionConstant.TOKEN);
    this.authService.setUser(null);
    this.router.navigate(['/dang-nhap']);
  }

  clickedToast(event: any) {
    if (event) {
      this.nzNotificationService.remove();
    }
  }

  getAvatar() {
    if (this.authService.getUser()?.avatar) {
      this.fileService.getFile(SystemConstant.FOLDER_AVATAR + this.authService.getUser()?.avatar)
        .subscribe((res: any) => {
          if (res) {
            this.avatar = res;
          }
        });
    }
  }
}
