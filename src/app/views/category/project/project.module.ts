import { NgModule } from '@angular/core';
import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ProjectAddEditModalComponent } from './modals/project-add-edit-modal/project-add-edit-modal.component';

const APP_MODALS = [
  ProjectAddEditModalComponent
];

@NgModule({
  imports: [
    SharedModule,
    ProjectRoutingModule
  ],
  declarations: [
    ProjectComponent,
    APP_MODALS
  ],
  entryComponents: [APP_MODALS]
})
export class ProjectModule { }
