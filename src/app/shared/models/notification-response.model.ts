import { NotificationType } from '../enums/notification-type.enum';

export interface NotificationResponse {
    notificationId?: string;
    senderId?: string;
    sender?: string;
    content?: string;
    objectId?: string;
    notificationType?: NotificationType;
}
