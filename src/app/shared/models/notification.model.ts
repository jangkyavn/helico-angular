import { NotificationType } from '../enums/notification-type.enum';

export interface Notification {
    id?: string;
    senderId?: string;
    receiverId?: string;
    objectId?: string;
    content?: string;
    read?: boolean;
    view?: boolean;
    type?: NotificationType;
}
