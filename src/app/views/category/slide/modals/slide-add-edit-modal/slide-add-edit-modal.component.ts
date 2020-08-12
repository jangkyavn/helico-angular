import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MessageService } from 'src/app/shared/services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { makeSeoAlias, checkExtension } from 'src/app/shared/functions/utilities.function';
import { DataService } from 'src/app/shared/services/data.service';
import { SlideService } from 'src/app/shared/services/slide.service';
import { UploadService } from 'src/app/shared/services/upload.service';

@Component({
  selector: 'app-slide-add-edit-modal',
  templateUrl: './slide-add-edit-modal.component.html',
  styleUrls: ['./slide-add-edit-modal.component.scss']
})
export class SlideAddEditModalComponent implements OnInit {
  @Input() data: any;
  @Input() isAddNew: boolean;
  spinning: boolean;
  slideForm: FormGroup;
  loadingSaveChanges: boolean;
  languages: any[] = [];
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
    private slideService: SlideService,
    private dataService: DataService,
    private uploadService: UploadService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.slideForm.reset();

    this.spinning = true;
    if (this.isAddNew) {
      this.slideForm.patchValue({
        ...this.data,
        status: this.isAddNew ? true : this.data.status
      });
    } else {
      this.slideForm.patchValue({
        ...this.data
      });
      this.src = this.data.imageBase64;
    }

    this.spinning = false;
  }

  createForm() {
    this.slideForm = this.fb.group({
      id: [null],
      title_VN: [null],
      title_EN: [null],
      description_VN: [null],
      description_EN: [null],
      image: [null],
      imageName: [null, [Validators.required]],
      url_VN: [null],
      url_EN: [null],
      position: [null],
      createdDate: [null],
      createdBy: [null],
      status: [null]
    });
  }

  saveChanges() {
    this.loadingSaveChanges = true;

    if (this.slideForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.slideForm.controls) {
        this.slideForm.controls[i].markAsDirty();
        this.slideForm.controls[i].updateValueAndValidity();
      }

      this.loadingSaveChanges = false;
      return;
    }

    const data = this.slideForm.getRawValue();

    if (this.isAddNew) {
      this.uploadService.uploadFile(this.formData, 'images', 'slides')
        .subscribe((resFile: any) => {
          data.image = resFile.fileName;
          this.slideService.create(data).subscribe((res: any) => {
            if (res) {
              this.messageService.success(MessageConstant.CREATED_OK_MSG);
              this.loadingSaveChanges = false;
              this.slideForm.markAsPristine();
              this.isAddNew = false;
              this.data = res;
              this.slideForm.patchValue({
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
      this.uploadService.uploadFile(this.formData, 'images', 'slides', data.image)
        .subscribe((resFile: any) => {
          if (resFile.fileName) {
            data.image = resFile.fileName;
          }

          this.slideService.update(data).subscribe((res: any) => {
            if (res) {
              this.messageService.success(MessageConstant.UPDATED_OK_MSG);
              this.loadingSaveChanges = false;
              this.slideForm.markAsPristine();
              this.dataService.loadData(true);
            }
            this.loadingSaveChanges = false;
          }, _ => {
            this.loadingSaveChanges = false;
          });
        });
    }
  }

  changeName(input: any) {
    console.log(input);
    this.slideForm.patchValue({
      seoAlias: makeSeoAlias(input)
    });
  }

  uploadFile(files) {
    if (files && files[0]) {
      if (!checkExtension(files[0].name, this.validFileExtensions)) {
        this.messageService.error('File không hợp lệ.');
        return;
      }

      this.slideForm.patchValue({
        imageName: files[0].name
      });
      this.slideForm.markAsDirty();
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
