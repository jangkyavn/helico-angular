import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountChangePasswordComponent } from './account-change-password/account-change-password.component';

const APP_COMPONENTS = [
  AccountEditComponent,
  AccountChangePasswordComponent
];

@NgModule({
  imports: [
    SharedModule,
    AccountRoutingModule
  ],
  declarations: [AccountRoutingModule.components, APP_COMPONENTS]
})
export class AccountModule { }
