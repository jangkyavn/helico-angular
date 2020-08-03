import { NgModule } from '@angular/core';
import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ProjectAddEditModalComponent } from './modals/project-add-edit-modal/project-add-edit-modal.component';
import { DragDropDirective } from 'src/app/shared/directives/drag-drop.directive';

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
    DragDropDirective,
    APP_MODALS
  ],
  entryComponents: [APP_MODALS]
})
export class ProjectModule { }
