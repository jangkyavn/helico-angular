import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { DiariesRoutingModule } from './diaries-routing.module';

@NgModule({
  imports: [
    SharedModule,
    DiariesRoutingModule
  ],
  declarations: [DiariesRoutingModule.components]
})
export class DiariesModule { }
