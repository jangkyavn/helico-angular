import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationResponse } from '../models/notification-response.model';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    subAddNotification = new BehaviorSubject<NotificationResponse>(null);
    addNotification$ = this.subAddNotification.asObservable();

    subLoadNotificationCount = new BehaviorSubject<boolean>(false);
    loadNotificationCount$ = this.subLoadNotificationCount.asObservable();

    subCollapseSidebar = new BehaviorSubject<boolean>(false);
    collapseSidebar$ = this.subCollapseSidebar.asObservable();

    subUpdateAvatar = new BehaviorSubject<boolean>(false);
    updateAvatar$ = this.subUpdateAvatar.asObservable();

    addNotification(message: NotificationResponse) {
        this.subAddNotification.next(message);
    }

    loadNotificationCount(message: boolean) {
        this.subLoadNotificationCount.next(message);
    }

    collapseSidebar(message: boolean) {
        this.subCollapseSidebar.next(message);
    }

    updateAvatar(message: boolean) {
        this.subUpdateAvatar.next(message);
    }
}
