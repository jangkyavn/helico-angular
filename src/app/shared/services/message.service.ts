import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    confirmModal: NzModalRef;

    constructor(
        private messageService: NzMessageService,
        private modal: NzModalService) { }

    success(message: string) {
        this.messageService.remove();
        this.messageService.success(message);
    }

    error(message: string) {
        this.messageService.remove();
        this.messageService.error(message);
    }

    warning(message: string) {
        this.messageService.remove();
        this.messageService.warning(message);
    }

    info(message: string) {
        this.messageService.remove();
        this.messageService.info(message);
    }

    confirm(message: string, okCallBack: () => any, okType = null, okText = null, cancelText = null) {
        this.confirmModal = this.modal.confirm({
            nzTitle: 'Thông báo',
            nzContent: message,
            nzOkText: okText || 'Đồng ý',
            nzOkType: okType || 'primary',
            nzCancelText: cancelText || 'Hủy bỏ',
            nzOnOk: () => {
                okCallBack();
            }
        });
    }
}
