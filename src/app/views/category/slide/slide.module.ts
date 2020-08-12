import { NgModule } from '@angular/core';
import { SlideComponent } from './slide.component';
import { SlideRoutingModule } from './slide-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { SlideAddEditModalComponent } from './modals/slide-add-edit-modal/slide-add-edit-modal.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const APP_MODALS = [
  SlideAddEditModalComponent
];

@NgModule({
  imports: [
    SharedModule,
    DragDropModule,
    SlideRoutingModule
  ],
  declarations: [
    SlideComponent,
    APP_MODALS
  ],
  entryComponents: [APP_MODALS]
})
export class SlideModule { }
