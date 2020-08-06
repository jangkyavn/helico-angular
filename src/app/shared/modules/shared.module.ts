import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from 'src/app/ng-zorro.module';
import { RelativeTimePipe } from '../pipes/relative-time.pipe';
import { HasRoleDirective } from '../directives/has-role.directive';
import { SafePipe } from '../pipes/safe.pipe';
import { DragDropDirective } from '../directives/drag-drop.directive';

@NgModule({
    imports: [
        CommonModule,
        NgZorroModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        SafePipe,
        RelativeTimePipe,
        HasRoleDirective,
        DragDropDirective
    ],
    exports: [CommonModule,
        NgZorroModule,
        FormsModule,
        ReactiveFormsModule,
        SafePipe,
        RelativeTimePipe,
        HasRoleDirective,
        DragDropDirective
    ],
    entryComponents: []
})
export class SharedModule { }
