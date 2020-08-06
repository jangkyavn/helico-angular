import { NgModule } from '@angular/core';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ProductAddEditModalComponent } from './modals/product-add-edit-modal/product-add-edit-modal.component';

const APP_MODALS = [
  ProductAddEditModalComponent
];

@NgModule({
  imports: [
    SharedModule,
    CKEditorModule,
    ProductRoutingModule
  ],
  declarations: [
    ProductComponent,
    APP_MODALS
  ],
  entryComponents: [APP_MODALS]
})
export class ProductModule { }
