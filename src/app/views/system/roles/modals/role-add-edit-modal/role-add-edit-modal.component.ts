import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { MessageService } from 'src/app/shared/services/message.service';
import { Role } from 'src/app/shared/models/role.model';
import { RoleService } from 'src/app/shared/services/role.service';
import { MessageConstant } from 'src/app/shared/constants/message.constant';

@Component({
  selector: 'app-role-add-edit-modal',
  templateUrl: './role-add-edit-modal.component.html',
  styleUrls: ['./role-add-edit-modal.component.scss']
})
export class RoleAddEditModalComponent implements OnInit {
  @Input() data: Role;
  @Input() isAddNew: boolean;
  roles: Role[] = [];
  roleForm: FormGroup;
  loadingSaveChanges: boolean;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if ($event.ctrlKey && $event.key === 'Enter') {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private roleService: RoleService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.roleForm.reset();

    this.roleForm.patchValue({
      ...this.data
    });
  }

  createForm() {
    this.roleForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      position: [null],
      createdBy: [null],
      createdDate: [null],
      status: [null]
    });
  }

  saveChanges() {
    this.loadingSaveChanges = true;

    if (this.roleForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.roleForm.controls) {
        this.roleForm.controls[i].markAsDirty();
        this.roleForm.controls[i].updateValueAndValidity();
      }

      this.loadingSaveChanges = false;
      return;
    }

    const data = this.roleForm.getRawValue() as Role;
    if (this.isAddNew) {
      this.roleService.create(data).subscribe((res: any) => {
        if (res) {
          this.messageService.success(MessageConstant.CREATED_OK_MSG);
          this.loadingSaveChanges = false;
          this.modal.destroy(true);
        }

        this.loadingSaveChanges = false;
      }, _ => {
        this.loadingSaveChanges = false;
      });
    } else {
      this.roleService.update(data).subscribe((res: any) => {
        if (res) {
          this.messageService.success(MessageConstant.UPDATED_OK_MSG);
          this.loadingSaveChanges = false;
          this.modal.destroy(true);
        }

        this.loadingSaveChanges = false;
      }, _ => {
        this.loadingSaveChanges = false;
      });
    }
  }

  destroyModal() {
    this.modal.destroy(false);
  }
}
