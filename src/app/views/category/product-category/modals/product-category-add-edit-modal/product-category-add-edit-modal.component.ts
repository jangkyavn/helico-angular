import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ProductCategoryService } from 'src/app/shared/services/product-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { LanguageService } from 'src/app/shared/services/language.service';
import { forkJoin } from 'rxjs';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { makeSeoAlias } from 'src/app/shared/functions/utilities.function';

@Component({
  selector: 'app-product-category-add-edit-modal',
  templateUrl: './product-category-add-edit-modal.component.html',
  styleUrls: ['./product-category-add-edit-modal.component.scss']
})
export class ProductCategoryAddEditModalComponent implements OnInit {
  @Input() data: any;
  @Input() isAddNew: boolean;
  spinning: boolean;
  productCategoryForm: FormGroup;
  loadingSaveChanges: boolean;
  languages: any[] = [];

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if ($event.ctrlKey && $event.key === 'Enter') {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private productCategoryService: ProductCategoryService,
    private languageService: LanguageService,
    private utilityService: UtilityService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.productCategoryForm.reset();

    this.spinning = true;
    this.forkJoin().subscribe((res: any) => {
      this.languages = res[0];

      if (this.isAddNew) {
        this.productCategoryForm.patchValue({
          ...this.data,
          languageId: this.languages.filter(x => x.isDefault === true)[0].id,
          status: this.isAddNew ? true : this.data.status
        });
      } else {
        this.productCategoryForm.patchValue({
          ...this.data,
          languageId: this.languages.filter(x => x.isDefault === true)[0].id
        });
      }

      this.spinning = false;
    });
  }

  forkJoin() {
    return forkJoin([
      this.languageService.getAll()
    ]);
  }

  createForm() {
    this.productCategoryForm = this.fb.group({
      id: [null],
      position: [null],
      languageId: [null],
      name: [null, [Validators.required]],
      seoPageTitle: [null, [Validators.required]],
      seoAlias: [null, [Validators.required]],
      seoKeywords: [null],
      seoDescription: [null],
      createdDate: [null],
      createdBy: [null],
      status: [null]
    });
  }

  saveChanges() {
    this.loadingSaveChanges = true;

    if (this.productCategoryForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.productCategoryForm.controls) {
        this.productCategoryForm.controls[i].markAsDirty();
        this.productCategoryForm.controls[i].updateValueAndValidity();
      }

      this.loadingSaveChanges = false;
      return;
    }

    const data = this.productCategoryForm.getRawValue();
    if (this.isAddNew) {
      this.productCategoryService.create(data).subscribe((res: any) => {
        if (res) {
          this.messageService.success(MessageConstant.CREATED_OK_MSG);
          this.loadingSaveChanges = false;
          this.productCategoryForm.markAsPristine();
          // this.modal.destroy(true);
        }

        this.loadingSaveChanges = false;
      }, _ => {
        this.loadingSaveChanges = false;
      });
    } else {
      this.productCategoryService.update(data).subscribe((res: any) => {
        if (res) {
          this.messageService.success(MessageConstant.UPDATED_OK_MSG);
          this.loadingSaveChanges = false;
          this.productCategoryForm.markAsPristine();
          // this.modal.destroy(true);
        }

        this.loadingSaveChanges = false;
      }, _ => {
        this.loadingSaveChanges = false;
      });
    }
  }

  changeTenLoai(input: any) {
    this.productCategoryForm.patchValue({
      seoAlias: makeSeoAlias(input)
    });
  }

  destroyModal() {
    this.modal.destroy(false);
  }
}
