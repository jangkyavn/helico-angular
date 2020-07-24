import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { User } from 'src/app/shared/models/user.model';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EnumModel } from 'src/app/shared/models/enum.model';
import { RoleService } from 'src/app/shared/services/role.service';
import { Role } from 'src/app/shared/models/role.model';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent implements OnInit {
  accountForm: FormGroup;
  loadingSaveChanges = false;
  roles: Role[] = [];
  genders: EnumModel[] = [];

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if ($event.ctrlKey && $event.key === 'Enter') {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
    private utilityService: UtilityService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.createForm();
    this.accountForm.reset();

    this.forkJoin().subscribe((res: any) => {
      const data: User = res[0];
      this.roles = res[1];
      this.genders = res[2];

      this.accountForm.patchValue({
        ...data,
        birthDay: this.utilityService.getFormatedInputDate(data.birthDay),
        roleId: data.roles[0].id
      });
    });
  }

  forkJoin() {
    return forkJoin([
      this.userService.getById(this.authService.getUser().nameid),
      this.roleService.getAll(),
      this.userService.getGenders()
    ]);
  }

  createForm() {
    this.accountForm = this.fb.group({
      id: [null],
      userName: [{ value: null, disabled: true }],
      fullName: [null, [Validators.required]],
      email: [null, [
        Validators.required,
        Validators.email,
      ]],
      gender: [null, [Validators.required]],
      birthDay: [null, [Validators.required]],
      roleId: [{ value: null, disabled: true }],
      roleName: [null],
      status: [null]
    });
  }

  saveChanges(): void {
    this.loadingSaveChanges = true;

    if (this.accountForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.accountForm.controls) {
        this.accountForm.controls[i].markAsDirty();
        this.accountForm.controls[i].updateValueAndValidity();
      }

      this.loadingSaveChanges = false;
      return;
    }

    const data = this.accountForm.getRawValue() as User;
    this.userService.update(data).subscribe((res: any) => {
      if (res) {
        this.messageService.success(MessageConstant.UPDATED_OK_MSG);
        this.loadingSaveChanges = false;
      }

      this.loadingSaveChanges = false;
    }, _ => {
      this.loadingSaveChanges = false;
    });
  }
}
