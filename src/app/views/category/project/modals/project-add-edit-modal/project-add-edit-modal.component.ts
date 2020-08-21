import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ProjectService } from 'src/app/shared/services/project.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { checkExtension } from 'src/app/shared/functions/utilities.function';
import { DataService } from 'src/app/shared/services/data.service';
import { ProjectCategoryService } from 'src/app/shared/services/project-category.service';
import { UploadService } from 'src/app/shared/services/upload.service';

@Component({
  selector: 'app-project-add-edit-modal',
  templateUrl: './project-add-edit-modal.component.html',
  styleUrls: ['./project-add-edit-modal.component.scss']
})
export class ProjectAddEditModalComponent implements OnInit {
  @Input() data: any;
  @Input() isAddNew: boolean;
  spinning: boolean;
  projectForm: FormGroup;
  loadingSaveChanges: boolean;
  projectCategories: any[] = [];
  config: any = {
    ///
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
    private projectService: ProjectService,
    private projectCategoryService: ProjectCategoryService,
    private dataService: DataService,
    private uploadService: UploadService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.projectForm.reset();

    this.spinning = true;
    this.forkJoin().subscribe((res: any) => {
      this.projectCategories = res[0];

      if (this.isAddNew) {
        this.projectForm.patchValue({
          ...this.data,
          isHighlight: false,
          selectedAsSlider: false,
          status: this.isAddNew ? true : this.data.status
        });
      } else {
        this.projectForm.patchValue({
          ...this.data
        });
        this.src = this.data.imageBase64;
      }

      this.spinning = false;
    });
  }

  forkJoin() {
    return forkJoin([
      this.projectCategoryService.getAll()
    ]);
  }

  createForm() {
    this.projectForm = this.fb.group({
      id: [null],
      categoryId: [null, [Validators.required]],
      image: [null],
      imageName: [null, [Validators.required]],
      name_VN: [null, [Validators.required]],
      name_EN: [null, [Validators.required]],
      content_VN: [null],
      content_EN: [null],
      isHighlight: [null],
      selectedAsSlider: [null],
      createdDate: [null],
      createdBy: [null],
      status: [null]
    });
  }

  saveChanges() {
    this.loadingSaveChanges = true;

    if (this.projectForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.projectForm.controls) {
        this.projectForm.controls[i].markAsDirty();
        this.projectForm.controls[i].updateValueAndValidity();
      }

      this.loadingSaveChanges = false;
      return;
    }

    const data = this.projectForm.getRawValue();

    if (this.isAddNew) {
      this.uploadService.uploadFile(this.formData, 'images', 'projects')
        .subscribe((resFile: any) => {
          data.image = resFile.fileName;
          this.projectService.create(data).subscribe((res: any) => {
            if (res) {
              this.messageService.success(MessageConstant.CREATED_OK_MSG);
              this.loadingSaveChanges = false;
              this.projectForm.markAsPristine();
              this.isAddNew = false;
              this.data = res;
              this.projectForm.patchValue({
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
      this.uploadService.uploadFile(this.formData, 'images', 'projects', data.image)
        .subscribe((resFile: any) => {
          if (resFile.fileName) {
            data.image = resFile.fileName;
          }

          this.projectService.update(data).subscribe((res: any) => {
            if (res) {
              this.messageService.success(MessageConstant.UPDATED_OK_MSG);
              this.loadingSaveChanges = false;
              this.projectForm.markAsPristine();
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

      this.projectForm.patchValue({
        imageName: files[0].name
      });
      this.projectForm.markAsDirty();
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
