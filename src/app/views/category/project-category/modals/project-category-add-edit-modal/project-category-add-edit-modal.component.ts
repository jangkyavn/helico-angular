import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ProjectCategoryService } from 'src/app/shared/services/project-category.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-project-category-add-edit-modal',
  templateUrl: './project-category-add-edit-modal.component.html',
  styleUrls: ['./project-category-add-edit-modal.component.scss']
})
export class ProjectCategoryAddEditModalComponent implements OnInit {
  @Input() data: any;
  @Input() isAddNew: boolean;
  spinning: boolean;
  projectCategoryForm: FormGroup;
  loadingSaveChanges: boolean;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if ($event.ctrlKey && $event.key === 'Enter') {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private projectCategoryService: ProjectCategoryService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.projectCategoryForm.reset();

    this.spinning = true;
    if (this.isAddNew) {
      this.projectCategoryForm.patchValue({
        ...this.data,
        status: this.isAddNew ? true : this.data.status
      });
    } else {
      this.projectCategoryForm.patchValue({
        ...this.data
      });
    }

    this.spinning = false;
  }

  createForm() {
    this.projectCategoryForm = this.fb.group({
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

    if (this.projectCategoryForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.projectCategoryForm.controls) {
        this.projectCategoryForm.controls[i].markAsDirty();
        this.projectCategoryForm.controls[i].updateValueAndValidity();
      }

      this.loadingSaveChanges = false;
      return;
    }

    const data = this.projectCategoryForm.getRawValue();
    if (this.isAddNew) {
      this.projectCategoryService.create(data).subscribe((res: any) => {
        if (res) {
          this.messageService.success(MessageConstant.CREATED_OK_MSG);
          this.modal.destroy(true);
        } else {
          this.messageService.success(MessageConstant.AN_ERROR_OCCURED);
        }

        this.loadingSaveChanges = false;
      }, _ => {
        this.loadingSaveChanges = false;
      });
    } else {
      this.projectCategoryService.update(data).subscribe((res: any) => {
        if (res) {
          this.messageService.success(MessageConstant.UPDATED_OK_MSG);
          this.modal.destroy(true);
        } else {
          this.messageService.success(MessageConstant.AN_ERROR_OCCURED);
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
