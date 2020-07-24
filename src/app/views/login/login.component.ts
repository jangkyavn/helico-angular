import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/shared/services/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { DiaryService } from 'src/app/shared/services/diary.service';
import { Diary } from 'src/app/shared/models/diary.model';
import { Action } from 'src/app/shared/enums/action.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean;
  passwordVisible = false;
  returnUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private diaryService: DiaryService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/']);
    }

    this.route
      .queryParams
      .subscribe(params => this.returnUrl = params.returnUrl);

    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    this.isLoading = true;

    if (!this.loginForm.valid) {
      for (const i in this.loginForm.controls) {
        this.loginForm.controls[i].markAsDirty();
        this.loginForm.controls[i].updateValueAndValidity();
      }

      this.isLoading = false;
      return;
    } else {
      const user = this.loginForm.value;
      this.authService.login(user).subscribe(res => {
        if (res.status) {
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigate(['/']);
          }

          const diary: Diary = {
            action: Action.Login,
          };
          this.diaryService.create(diary).subscribe();
        } else {
          this.messageService.warning(res.messsage);
        }
        this.isLoading = false;
      }, _ => {
        this.isLoading = false;
      });
    }
  }
}
