import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { SessionConstant } from 'src/app/shared/constants/session.constant';

@Component({
  selector: 'app-account-change-password',
  templateUrl: './account-change-password.component.html',
  styleUrls: ['./account-change-password.component.scss']
})
export class AccountChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  loadingSaveChanges: boolean;
  currentPasswordVisible = false;
  newPasswordVisible = false;
  confirmNewPasswordVisible = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.changePasswordForm = this.fb.group({
      currentPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmNewPassword: [null, [Validators.required]]
    });
  }

  saveChanges() {
    this.loadingSaveChanges = true;

    if (this.changePasswordForm.invalid) {
      // tslint:disable-next-line:forin
      for (const key in this.changePasswordForm.controls) {
        this.changePasswordForm.controls[key].markAsDirty();
        this.changePasswordForm.controls[key].updateValueAndValidity();
      }
      this.loadingSaveChanges = false;
      return;
    }

    const { newPassword } = this.changePasswordForm.value;
    const data = {
      password: newPassword
    };
    this.userService.changePassword(data).subscribe((res: boolean) => {
      if (res) {
        this.messageService.success('Thay đổi mật khẩu thành công');
        this.loadingSaveChanges = false;
        this.changePasswordForm.reset();
        this.messageService.confirm('Vui lòng đăng xuất để sử dụng mật khẩu mới!', () => {
          localStorage.removeItem(SessionConstant.TOKEN);
          this.authService.setUser(null);
          this.router.navigate(['/dang-nhap']);
        }, null, 'Đăng xuất', 'Để sau');
      }
    }, _ => {
      this.loadingSaveChanges = false;
    });
  }
}
