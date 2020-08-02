import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ProjectCategoryService } from 'src/app/shared/services/project-category.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { LanguageService } from 'src/app/shared/services/language.service';
import { forkJoin } from 'rxjs';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { makeSeoAlias } from 'src/app/shared/functions/utilities.function';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-project-category-add-edit-modal',
  templateUrl: './project-category-add-edit-modal.component.html',
  styleUrls: ['./project-category-add-edit-modal.component.scss']
})
export class ProjectCategoryAddEditModalComponent implements OnInit {
  @Input() data: any;
  @Input() isAddNew: boolean;
  @Input() selectedLanguage: string;
  spinning: boolean;
  projectCategoryForm: FormGroup;
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
    private projectCategoryService: ProjectCategoryService,
    private languageService: LanguageService,
    private dataService: DataService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.projectCategoryForm.reset();

    this.spinning = true;
    this.forkJoin().subscribe((res: any) => {
      this.languages = res[0];

      if (this.isAddNew) {
        this.projectCategoryForm.patchValue({
          ...this.data,
          languageId: this.selectedLanguage,
          status: this.isAddNew ? true : this.data.status
        });
      } else {
        this.projectCategoryForm.patchValue({
          ...this.data
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
    this.projectCategoryForm = this.fb.group({
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
          this.loadingSaveChanges = false;
          this.projectCategoryForm.markAsPristine();
          this.isAddNew = false;
          this.data = res;
          this.dataService.loadData(true);
        }

        this.loadingSaveChanges = false;
      }, _ => {
        this.loadingSaveChanges = false;
      });
    } else {
      this.projectCategoryService.update(data).subscribe((res: any) => {
        if (res) {
          this.messageService.success(MessageConstant.UPDATED_OK_MSG);
          this.loadingSaveChanges = false;
          this.projectCategoryForm.markAsPristine();
          this.dataService.loadData(true);
        }

        this.loadingSaveChanges = false;
      }, _ => {
        this.loadingSaveChanges = false;
      });
    }
  }

  changeName(input: any) {
    console.log(input);
    this.projectCategoryForm.patchValue({
      seoAlias: makeSeoAlias(input)
    });
  }

  changeLanguage(event: any) {
    this.spinning = true;
    this.projectCategoryForm.markAsPristine();
    if (this.isAddNew === false) {
      this.projectCategoryService.getById(this.data.id, event)
        .subscribe((res: any) => {
          this.projectCategoryForm.patchValue({
            id: res.id,
            position: res.position,
            name: res.name,
            seoPageTitle: res.seoPageTitle,
            seoAlias: res.seoAlias,
            seoKeywords: res.seoKeywords,
            seoDescription: res.seoDescription,
            createdDate: res.createdDate,
            createdBy: res.createdBy,
            status: res.status
          });
          this.projectCategoryForm.markAsPristine();
          this.spinning = false;
        });
    }
  }

  destroyModal() {
    this.modal.destroy(false);
  }
}
