import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { checkExtension } from 'src/app/shared/functions/utilities.function';
import { DataService } from 'src/app/shared/services/data.service';
import { ProductCategoryService } from 'src/app/shared/services/product-category.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-product-add-edit-modal',
  templateUrl: './product-add-edit-modal.component.html',
  styleUrls: ['./product-add-edit-modal.component.scss']
})
export class ProductAddEditModalComponent implements OnInit {
  @Input() data: any;
  @Input() isAddNew: boolean;
  @Input() selectedLanguage: string;
  spinning: boolean;
  productForm: FormGroup;
  loadingSaveChanges: boolean;
  productCategories: any[] = [];
  config: any = {
    extraPlugins: 'colorbutton',
    filebrowserUploadUrl: '/api/Upload/UploadImageForCKEditor?folderName=products',
    filebrowserUploadMethod: 'form'
  };
  files: any = [];
  src: any;
  formData = new FormData();
  validFileExtensions = ['.jpg', '.jpeg', '.bmp', '.gif', '.png', '.JPG', '.JPGE', '.BMP', '.GIF', '.PNG'];

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if ($event.ctrlKey && $event.key === 'Enter') {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private dataService: DataService,
    private uploadService: UploadService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.productForm.reset();

    this.spinning = true;
    this.forkJoin().subscribe((res: any) => {
      this.productCategories = res[0];
      if (this.isAddNew) {
        this.productForm.patchValue({
          ...this.data,
          price: 0,
          quantity: 0,
          status: this.isAddNew ? true : this.data.status
        });
      } else {
        this.productForm.patchValue({
          ...this.data
        });
        this.src = this.data.imageBase64;
      }

      this.spinning = false;
    });
  }

  forkJoin() {
    return forkJoin([
      this.productCategoryService.getAll()
    ]);
  }

  createForm() {
    this.productForm = this.fb.group({
      id: [null],
      categoryId: [null, [Validators.required]],
      image: [null],
      imageName: [null, [Validators.required]],
      name_VN: [null, [Validators.required]],
      name_EN: [null, [Validators.required]],
      shortDescription_VN: [null],
      shortDescription_EN: [null],
      detailedDescription_VN: [null],
      detailedDescription_EN: [null],
      quantity: [null],
      price: [null],
      isHighlight: [null],
      createdDate: [null],
      createdBy: [null],
      status: [null]
    });
  }

  saveChanges() {
    this.loadingSaveChanges = true;

    if (this.productForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.productForm.controls) {
        this.productForm.controls[i].markAsDirty();
        this.productForm.controls[i].updateValueAndValidity();
      }

      this.loadingSaveChanges = false;
      return;
    }

    const data = this.productForm.getRawValue();

    if (this.isAddNew) {
      this.uploadService.uploadFile(this.formData, 'images', 'products')
        .subscribe((resFile: any) => {
          data.image = resFile.fileName;
          this.productService.create(data).subscribe((res: any) => {
            if (res) {
              this.messageService.success(MessageConstant.CREATED_OK_MSG);
              this.loadingSaveChanges = false;
              this.productForm.markAsPristine();
              this.isAddNew = false;
              this.data = res;
              this.productForm.patchValue({
                ...data,
                id: res.id,
                createdDate: res.createdDate,
                createdBy: res.createdBy
              });
              this.dataService.loadData(true);
            }
            this.loadingSaveChanges = false;
          }, _ => {
            this.loadingSaveChanges = false;
          });
        }, _ => {
          this.loadingSaveChanges = false;
        });
    } else {
      this.uploadService.uploadFile(this.formData, 'images', 'products', data.image)
        .subscribe((resFile: any) => {
          if (resFile.fileName) {
            data.image = resFile.fileName;
          }

          this.productService.update(data).subscribe((res: any) => {
            if (res) {
              this.messageService.success(MessageConstant.UPDATED_OK_MSG);
              this.loadingSaveChanges = false;
              this.productForm.markAsPristine();
              this.dataService.loadData(true);
            }
            this.loadingSaveChanges = false;
          }, _ => {
            this.loadingSaveChanges = false;
          });
        });
    }
  }

  uploadFile(files) {
    if (files && files[0]) {
      if (!checkExtension(files[0].name, this.validFileExtensions)) {
        this.messageService.error('File không hợp lệ.');
        return;
      }

      this.productForm.patchValue({
        imageName: files[0].name
      });
      this.productForm.markAsDirty();
      this.formData.delete('file');
      this.formData.append('file', files[0]);

      const reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        this.src = (event.target as FileReader).result;
      };

      reader.readAsDataURL(files[0]);
    }
  }

  destroyModal() {
    this.modal.destroy(false);
  }
}
