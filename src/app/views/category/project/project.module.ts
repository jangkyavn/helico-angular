import { NgModule } from '@angular/core';
import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ProjectAddEditModalComponent } from './modals/project-add-edit-modal/project-add-edit-modal.component';

const APP_MODALS = [
  ProjectAddEditModalComponent
];

@NgModule({
  imports: [
    SharedModule,
    CKEditorModule,
    ProjectRoutingModule
  ],
  declarations: [
    ProjectComponent,
    APP_MODALS
  ],
  entryComponents: [APP_MODALS]
})
export class ProjectModule { }
