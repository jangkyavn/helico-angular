import { NgModule } from '@angular/core';
import { ProductCategoryComponent } from './product-category.component';
import { ProductCategoryRoutingModule } from './product-category-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ProductCategoryAddEditModalComponent } from './modals/product-category-add-edit-modal/product-category-add-edit-modal.component';

const APP_MODALS = [
  ProductCategoryAddEditModalComponent
];

@NgModule({
  imports: [
    SharedModule,
    ProductCategoryRoutingModule
  ],
  declarations: [
    ProductCategoryComponent,
    APP_MODALS
  ],
  entryComponents: [APP_MODALS]
})
export class ProductCategoryModule { }
