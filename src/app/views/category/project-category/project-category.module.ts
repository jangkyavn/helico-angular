import { NgModule } from '@angular/core';
import { ProjectCategoryComponent } from './project-category.component';
import { ProjectCategoryRoutingModule } from './project-category-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ProjectCategoryAddEditModalComponent } from './modals/project-category-add-edit-modal/project-category-add-edit-modal.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const APP_MODALS = [
  ProjectCategoryAddEditModalComponent
];

@NgModule({
  imports: [
    SharedModule,
    DragDropModule,
    ProjectCategoryRoutingModule
  ],
  declarations: [
    ProjectCategoryComponent,
    APP_MODALS
  ],
  entryComponents: [APP_MODALS]
})
export class ProjectCategoryModule { }
