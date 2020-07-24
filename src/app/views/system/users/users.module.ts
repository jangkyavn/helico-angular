import { NgModule } from '@angular/core';
import { UserAddEditModalComponent } from './modals/user-add-edit-modal/user-add-edit-modal.component';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

const APP_MODALS = [
  UserAddEditModalComponent
];

@NgModule({
  imports: [
    SharedModule,
    UsersRoutingModule
  ],
  declarations: [UsersRoutingModule.components, APP_MODALS]
})
export class UsersModule { }
