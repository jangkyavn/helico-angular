import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { Role } from 'src/app/shared/models/role.model';
import { RoleService } from 'src/app/shared/services/role.service';
import { forkJoin } from 'rxjs';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { EnumModel } from 'src/app/shared/models/enum.model';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-user-add-edit-modal',
  templateUrl: './user-add-edit-modal.component.html',
  styleUrls: ['./user-add-edit-modal.component.scss']
})
export class UserAddEditModalComponent implements OnInit {
  @Input() data: User;
  @Input() isAddNew: boolean;
  roles: Role[] = [];
  genders: EnumModel[] = [];
  spinning: boolean;
  userForm: FormGroup;
  loadingSaveChanges: boolean;
  passwordVisible = false;
  confirmPasswordVisible = false;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if ($event.ctrlKey && $event.key === 'Enter') {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private userService: UserService,
    private roleService: RoleService,
    private utilityService: UtilityService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.userForm.reset();

    this.spinning = true;
    this.forkJoin().subscribe((res: any) => {
      this.roles = res[0];
      this.genders = res[1];

      this.userForm.patchValue({
        ...this.data,
        birthDay: this.utilityService.getFormatedInputDate(this.data.birthDay),
        roleId: this.isAddNew ? '' : this.data.roles[0].id,
        status: this.isAddNew ? false : this.data.status
      });

      this.spinning = false;
    });
  }

  forkJoin() {
    return forkJoin([
      this.roleService.getAll(),
      this.userService.getGenders()
    ]);
  }

  createForm() {
    if (this.isAddNew) {
      this.userForm = this.fb.group({
        id: [null],
        userName: [null, [Validators.required]],
        password: [null, [
          Validators.required,
          Validators.minLength(6)]
        ],
        confirmPassword: [null, [
          Validators.required,
          // passwordMatchValidator
        ]],
        fullName: [null, [Validators.required]],
        email: [null, [
          Validators.required,
          Validators.email
        ]],
        gender: [null, [Validators.required]],
        birthDay: [null, [Validators.required]],
        roleId: [null, [Validators.required]],
        roleName: [null],
        status: [null]
      });
    } else {
      this.userForm = this.fb.group({
        id: [null],
        userName: [{ value: null, disabled: true }, [
          Validators.required
        ]],
        fullName: [null, [Validators.required]],
        email: [null, [
          Validators.required,
          Validators.email,
        ]],
        gender: [null, [Validators.required]],
        birthDay: [null, [Validators.required]],
        roleId: [{ value: null, disabled: this.data.userName === 'admin' ? true : false }, [Validators.required]],
        roleName: [null],
        status: [{ value: null, disabled: this.data.userName === 'admin' ? true : false }]
      });
    }
  }

  saveChanges() {
    this.loadingSaveChanges = true;

    if (this.userForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.userForm.controls) {
        this.userForm.controls[i].markAsDirty();
        this.userForm.controls[i].updateValueAndValidity();
      }

      this.loadingSaveChanges = false;
      return;
    }

    const data = this.userForm.getRawValue() as User;
    data.roles = [this.roles.find(x => x.id === data.roleId)];
    if (this.isAddNew) {
      this.userService.create(data).subscribe((res: any) => {
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
      this.userService.update(data).subscribe((res: any) => {
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
