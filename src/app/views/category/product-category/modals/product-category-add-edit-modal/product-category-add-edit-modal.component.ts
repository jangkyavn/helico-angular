import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ProductCategoryService } from 'src/app/shared/services/product-category.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-product-category-add-edit-modal',
  templateUrl: './product-category-add-edit-modal.component.html',
  styleUrls: ['./product-category-add-edit-modal.component.scss']
})
export class ProductCategoryAddEditModalComponent implements OnInit {
  @Input() data: any;
  @Input() isAddNew: boolean;
  @Input() selectedLanguage: string;
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
    private dataService: DataService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.productCategoryForm.reset();

    this.spinning = true;
    if (this.isAddNew) {
      this.productCategoryForm.patchValue({
        ...this.data,
        status: this.isAddNew ? true : this.data.status
      });
    } else {
      this.productCategoryForm.patchValue({
        ...this.data
      });
    }

    this.spinning = false;
  }

  createForm() {
    this.productCategoryForm = this.fb.group({
      id: [null],
      position: [null],
      name_VN: [null, [Validators.required]],
      name_EN: [null, [Validators.required]],
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
          this.isAddNew = false;
          this.data = res;
          this.productCategoryForm.patchValue({
            ...data,
            id: res.id,
            position: res.position,
            createdDate: res.createdDate,
            createdBy: res.createdBy
          });
          this.dataService.loadData(true);
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
          this.dataService.loadData(true);
        }

        this.loadingSaveChanges = false;
      }, _ => {
        this.loadingSaveChanges = false;
      });
    }
  }

  destroyModal() {
    this.modal.destroy(false);
  }
}
