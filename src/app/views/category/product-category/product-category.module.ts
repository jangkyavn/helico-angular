import { NgModule } from '@angular/core';
import { ProductCategoryComponent } from './product-category.component';
import { ProductCategoryRoutingModule } from './product-category-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ProductCategoryRoutingModule
  ],
  declarations: [ProductCategoryComponent]
})
export class ProductCategoryModule { }
