import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationResponse } from '../../models/notification-response.model';
import { DataService } from '../../services/data.service';
import { NotifycationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.scss']
})
export class ToastNotificationComponent implements OnInit {
  @Input() notificationRes: NotificationResponse;
  @Output() isClickedToast = new EventEmitter<boolean>(false);

  constructor(
    private router: Router,
    private dataService: DataService,
    private notificationService: NotifycationService
  ) { }

  ngOnInit() {
  }

  clickNotification() {
    const param = {
      id: this.notificationRes.notificationId
    };
    this.notificationService.markSeendNotification(param).subscribe(
      res => {
        this.dataService.loadNotificationCount(true);

        // if (this.notificationResponse.notificationType === NotificationType.CreateOrder ||
        //   this.notificationResponse.notificationType === NotificationType.UpdateOrder ||
        //   this.notificationResponse.notificationType === NotificationType.RequestApprovalOrder ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawRequestedApprovalOrder ||
        //   this.notificationResponse.notificationType === NotificationType.ApprovedOrder ||
        //   this.notificationResponse.notificationType === NotificationType.UnapprovedOrder ||
        //   this.notificationResponse.notificationType === NotificationType.CancelRequestApprovalOrder ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawCancelRequestApprovalOrder ||
        //   this.notificationResponse.notificationType === NotificationType.RequestSignOrder ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawRequestedSignOrder ||
        //   this.notificationResponse.notificationType === NotificationType.CancelRequestSignOrder ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawCancelRequestSignOrder ||
        //   this.notificationResponse.notificationType === NotificationType.SignedOrder ||
        //   this.notificationResponse.notificationType === NotificationType.SendEmailOrder ||
        //   this.notificationResponse.notificationType === NotificationType.ConvertOrder) {
        //   this.router.navigate(['/nghiep-vu/hoa-don/danh-sach'], { queryParams: { orderId: this.notificationResponse.objectId } });
        // } else if (this.notificationResponse.notificationType === NotificationType.CreateRemoveRecord ||
        //   this.notificationResponse.notificationType === NotificationType.UpdateRemoveRecord ||
        //   this.notificationResponse.notificationType === NotificationType.RequestApprovalRemoveRecord ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawRequestedApprovalRemoveRecord ||
        //   this.notificationResponse.notificationType === NotificationType.ApprovedRemoveRecord ||
        //   this.notificationResponse.notificationType === NotificationType.UnapprovedRemoveRecord ||
        //   this.notificationResponse.notificationType === NotificationType.CancelRequestApprovalRemoveRecord ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawCancelRequestApprovalRemoveRecord ||
        //   this.notificationResponse.notificationType === NotificationType.RequestSignRemoveRecord ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawRequestedSignRemoveRecord ||
        //   this.notificationResponse.notificationType === NotificationType.CancelRequestSignRemoveRecord ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawCancelRequestSignRemoveRecord ||
        //   this.notificationResponse.notificationType === NotificationType.SignedRemoveRecord ||
        //   this.notificationResponse.notificationType === NotificationType.RemoveOrder ||
        //   this.notificationResponse.notificationType === NotificationType.SendEmailRemoveRecord) {
        //   this.router.navigate(['/nghiep-vu/xoa-bo-hoa-don/danh-sach'], { queryParams: { orderId: this.notificationResponse.objectId } });
        // } else if (this.notificationResponse.notificationType === NotificationType.CreateReplaceOrder ||
        //   this.notificationResponse.notificationType === NotificationType.UpdateReplaceOrder ||
        //   this.notificationResponse.notificationType === NotificationType.RequestApprovalReplaceOrder ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawRequestedApprovalReplaceOrder ||
        //   this.notificationResponse.notificationType === NotificationType.ApprovedReplaceOrder ||
        //   this.notificationResponse.notificationType === NotificationType.UnapprovedReplaceOrder ||
        //   this.notificationResponse.notificationType === NotificationType.CancelRequestApprovalReplaceOrder ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawCancelRequestApprovalReplaceOrder ||
        //   this.notificationResponse.notificationType === NotificationType.RequestSignReplaceOrder ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawRequestedSignReplaceOrder ||
        //   this.notificationResponse.notificationType === NotificationType.CancelRequestSignReplaceOrder ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawCancelRequestSignReplaceOrder ||
        //   this.notificationResponse.notificationType === NotificationType.SignedReplaceOrder ||
        //   this.notificationResponse.notificationType === NotificationType.SendEmailReplaceOrder ||
        //   this.notificationResponse.notificationType === NotificationType.ConvertReplaceOrder) {
        //   this.router.navigate(['/nghiep-vu/hoa-don-thay-the/danh-sach'], { queryParams: { orderId: this.notificationResponse.objectId } });
        // } else if (this.notificationResponse.notificationType === NotificationType.CreateEditRecord ||
        //   this.notificationResponse.notificationType === NotificationType.UpdateEditRecord ||
        //   this.notificationResponse.notificationType === NotificationType.RequestApprovalEditRecord ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawRequestedApprovalEditRecord ||
        //   this.notificationResponse.notificationType === NotificationType.ApprovedEditRecord ||
        //   this.notificationResponse.notificationType === NotificationType.UnapprovedEditRecord ||
        //   this.notificationResponse.notificationType === NotificationType.CancelRequestApprovalEditRecord ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawCancelRequestApprovalEditRecord ||
        //   this.notificationResponse.notificationType === NotificationType.RequestSignEditRecord ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawRequestedSignEditRecord ||
        //   this.notificationResponse.notificationType === NotificationType.CancelRequestSignEditRecord ||
        //   this.notificationResponse.notificationType === NotificationType.WithdrawCancelRequestSignEditRecord ||
        //   this.notificationResponse.notificationType === NotificationType.SignedEditRecord ||
        //   this.notificationResponse.notificationType === NotificationType.SendEmailEditRecord) {
        //   this.router.navigate(['/nghiep-vu/dieu-chinh-hoa-don/danh-sach'], { queryParams: { orderId: this.notificationResponse.objectId } });
        // } else if (this.notificationResponse.notificationType === NotificationType.AuthorizationToSign ||
        //   this.notificationResponse.notificationType === NotificationType.UnauthorizationToSign) {
        //   this.dataService.changeRedirectTabMessage(4);
        // }

        this.isClickedToast.emit(true);
      });
  }
}
