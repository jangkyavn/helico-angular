import { NgModule } from '@angular/core';
import { RoleAddEditModalComponent } from './modals/role-add-edit-modal/role-add-edit-modal.component';
import { RolesRoutingModule } from './roles-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

const APP_MODALS = [
  RoleAddEditModalComponent
];

@NgModule({
  imports: [
    SharedModule,
    RolesRoutingModule,
    DragDropModule
  ],
  declarations: [RolesRoutingModule.components, APP_MODALS]
})
export class RolesModule { }
