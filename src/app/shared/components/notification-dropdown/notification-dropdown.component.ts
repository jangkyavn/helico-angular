import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NotifycationService } from '../../services/notification.service';
import { Pagination } from '../../models/pagination.model';
import { Notification } from '../../models/notification.model';
import { DataService } from '../../services/data.service';
import { NotificationResponse } from '../../models/notification-response.model';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.scss']
})
export class NotificationDropdownComponent implements OnInit {
  countNotify = 0;
  visible: boolean;
  initLoading = false;
  loadingMore = false;
  data: any[] = [];
  list: Array<{ loading: boolean; notification: Notification }> = [];
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 5,
  };
  isShowDropdown = false;
  isShowLoadMore = true;

  constructor(
    private router: Router,
    private notificationService: NotifycationService,
    private dataService: DataService) { }

  ngOnInit() {
    this.getCountUnView();

    this.dataService.addNotification$
      .subscribe((res: NotificationResponse) => {
        if (res) {
          this.getCountUnView();
        }
      });

    this.dataService.loadNotificationCount$
      .subscribe((res: boolean) => {
        if (res) {
          this.getCountUnView();
        }
      });
  }

  onChange($event: boolean) {
    this.isShowDropdown = $event;
    if (this.isShowDropdown === true) {
      this.initLoading = true;
      this.notificationService.markViewedAll().subscribe(() => {
        this.getCountUnView();
        this.loadNotifications(true);
      });
    }
  }

  loadNotifications(reset: boolean = false): void {
    if (reset) {
      this.pagination.currentPage = 1;
    }
    this.notificationService.getAllPaging(
      this.pagination.currentPage,
      this.pagination.itemsPerPage)
      .subscribe((res: any) => {
        this.data = res.result;
        this.list = res.result;
        this.pagination = res.pagination;
        this.initLoading = false;
        this.isShowLoadMore = true;

        if ((this.pagination.currentPage === this.pagination.totalPages) || (this.pagination.totalItems <= this.pagination.itemsPerPage)) {
          this.isShowLoadMore = false;
        }
      });
  }

  onLoadMore(): void {
    this.pagination.currentPage += 1;

    if (this.pagination.currentPage > this.pagination.totalPages) {
      return;
    }

    this.loadingMore = true;
    this.list = this.data.concat([...Array(5)].fill({}).map(() => ({ loading: true, notification: {} })));
    this.notificationService.getAllPaging(
      this.pagination.currentPage,
      this.pagination.itemsPerPage).subscribe((res: any) => {
        this.data = this.data.concat(res.result);
        this.list = [...this.data];
        this.pagination = res.pagination;
        this.loadingMore = false;

        if ((this.pagination.currentPage === this.pagination.totalPages) || (this.pagination.totalItems <= this.pagination.itemsPerPage)) {
          this.isShowLoadMore = false;
        }
      });
  }

  getCountUnView() {
    this.notificationService.getCountUnView().subscribe((res: number) => {
      this.countNotify = res;
    });
  }

  deleteAllNotification() {
    this.initLoading = true;
    this.notificationService.deleteAll()
      .subscribe((res: any) => {
        if (res) {
          this.loadNotifications(true);
        }
      });
  }

  readNotification(data: Notification) {
    this.isShowDropdown = false;
    const param = {
      id: data.id
    };
    this.notificationService.markSeendNotification(param).subscribe(
      res => {
        // this.dataService.changeLoadOrdersMessage(true, true);
        // if (data.type === NotificationType.CreateOrder ||
        //   data.type === NotificationType.UpdateOrder ||
        //   data.type === NotificationType.RequestApprovalOrder ||
        //   data.type === NotificationType.WithdrawRequestedApprovalOrder ||
        //   data.type === NotificationType.ApprovedOrder ||
        //   data.type === NotificationType.UnapprovedOrder ||
        //   data.type === NotificationType.CancelRequestApprovalOrder ||
        //   data.type === NotificationType.WithdrawCancelRequestApprovalOrder ||
        //   data.type === NotificationType.RequestSignOrder ||
        //   data.type === NotificationType.WithdrawRequestedSignOrder ||
        //   data.type === NotificationType.CancelRequestSignOrder ||
        //   data.type === NotificationType.WithdrawCancelRequestSignOrder ||
        //   data.type === NotificationType.SignedOrder ||
        //   data.type === NotificationType.SendEmailOrder ||
        //   data.type === NotificationType.ConvertOrder) {
        //   this.router.navigate(['/nghiep-vu/hoa-don/danh-sach'], { queryParams: { orderId: data.objectId } });
        // } else if (data.type === NotificationType.CreateRemoveRecord ||
        //   data.type === NotificationType.UpdateRemoveRecord ||
        //   data.type === NotificationType.RequestApprovalRemoveRecord ||
        //   data.type === NotificationType.WithdrawRequestedApprovalRemoveRecord ||
        //   data.type === NotificationType.ApprovedRemoveRecord ||
        //   data.type === NotificationType.UnapprovedRemoveRecord ||
        //   data.type === NotificationType.CancelRequestApprovalRemoveRecord ||
        //   data.type === NotificationType.WithdrawCancelRequestApprovalRemoveRecord ||
        //   data.type === NotificationType.RequestSignRemoveRecord ||
        //   data.type === NotificationType.WithdrawRequestedSignRemoveRecord ||
        //   data.type === NotificationType.CancelRequestSignRemoveRecord ||
        //   data.type === NotificationType.WithdrawCancelRequestSignRemoveRecord ||
        //   data.type === NotificationType.SignedRemoveRecord ||
        //   data.type === NotificationType.RemoveOrder ||
        //   data.type === NotificationType.SendEmailRemoveRecord) {
        //   this.router.navigate(['/nghiep-vu/xoa-bo-hoa-don/danh-sach'], { queryParams: { orderId: data.objectId } });
        // } else if (data.type === NotificationType.CreateReplaceOrder ||
        //   data.type === NotificationType.UpdateReplaceOrder ||
        //   data.type === NotificationType.RequestApprovalReplaceOrder ||
        //   data.type === NotificationType.WithdrawRequestedApprovalReplaceOrder ||
        //   data.type === NotificationType.ApprovedReplaceOrder ||
        //   data.type === NotificationType.UnapprovedReplaceOrder ||
        //   data.type === NotificationType.CancelRequestApprovalReplaceOrder ||
        //   data.type === NotificationType.WithdrawCancelRequestApprovalReplaceOrder ||
        //   data.type === NotificationType.RequestSignReplaceOrder ||
        //   data.type === NotificationType.WithdrawRequestedSignReplaceOrder ||
        //   data.type === NotificationType.CancelRequestSignReplaceOrder ||
        //   data.type === NotificationType.WithdrawCancelRequestSignReplaceOrder ||
        //   data.type === NotificationType.SignedReplaceOrder ||
        //   data.type === NotificationType.SendEmailReplaceOrder ||
        //   data.type === NotificationType.ConvertReplaceOrder) {
        //   this.router.navigate(['/nghiep-vu/hoa-don-thay-the/danh-sach'], { queryParams: { orderId: data.objectId } });
        // } else if (data.type === NotificationType.CreateEditRecord ||
        //   data.type === NotificationType.UpdateEditRecord ||
        //   data.type === NotificationType.RequestApprovalEditRecord ||
        //   data.type === NotificationType.WithdrawRequestedApprovalEditRecord ||
        //   data.type === NotificationType.ApprovedEditRecord ||
        //   data.type === NotificationType.UnapprovedEditRecord ||
        //   data.type === NotificationType.CancelRequestApprovalEditRecord ||
        //   data.type === NotificationType.WithdrawCancelRequestApprovalEditRecord ||
        //   data.type === NotificationType.RequestSignEditRecord ||
        //   data.type === NotificationType.WithdrawRequestedSignEditRecord ||
        //   data.type === NotificationType.CancelRequestSignEditRecord ||
        //   data.type === NotificationType.WithdrawCancelRequestSignEditRecord ||
        //   data.type === NotificationType.SignedEditRecord ||
        //   data.type === NotificationType.SendEmailEditRecord) {
        //   this.router.navigate(['/nghiep-vu/dieu-chinh-hoa-don/danh-sach'], { queryParams: { orderId: data.objectId } });
        // } else if (data.type === NotificationType.AuthorizationToSign ||
        //   data.type === NotificationType.UnauthorizationToSign) {
        //   this.dataService.changeRedirectTabMessage(4);
        // }
      });
  }
}
