import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ProjectService } from 'src/app/shared/services/project.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { LanguageService } from 'src/app/shared/services/language.service';
import { forkJoin } from 'rxjs';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { makeSeoAlias } from 'src/app/shared/functions/utilities.function';
import { DataService } from 'src/app/shared/services/data.service';
import { ProjectCategoryService } from 'src/app/shared/services/project-category.service';

@Component({
  selector: 'app-project-add-edit-modal',
  templateUrl: './project-add-edit-modal.component.html',
  styleUrls: ['./project-add-edit-modal.component.scss']
})
export class ProjectAddEditModalComponent implements OnInit {
  @Input() data: any;
  @Input() isAddNew: boolean;
  @Input() selectedLanguage: string;
  spinning: boolean;
  projectForm: FormGroup;
  loadingSaveChanges: boolean;
  languages: any[] = [];
  projectCategories: any[] = [];

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
    private languageService: LanguageService,
    private dataService: DataService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.projectForm.reset();

    this.spinning = true;
    this.forkJoin().subscribe((res: any) => {
      this.languages = res[0];
      this.projectCategories = res[1];
      console.log(res[1]);

      if (this.isAddNew) {
        this.projectForm.patchValue({
          ...this.data,
          languageId: this.selectedLanguage,
          status: this.isAddNew ? true : this.data.status
        });
      } else {
        this.projectForm.patchValue({
          ...this.data
        });
      }

      this.spinning = false;
    });
  }

  forkJoin() {
    return forkJoin([
      this.languageService.getAll(),
      this.projectCategoryService.getAll(this.selectedLanguage)
    ]);
  }

  createForm() {
    this.projectForm = this.fb.group({
      id: [null],
      categoryId: [null, [Validators.required]],
      languageId: [null],
      name: [null, [Validators.required]],
      description: [null],
      content: [null],
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
      this.projectService.create(data).subscribe((res: any) => {
        if (res) {
          this.messageService.success(MessageConstant.CREATED_OK_MSG);
          this.loadingSaveChanges = false;
          this.projectForm.markAsPristine();
          this.isAddNew = false;
          this.data = res;
          this.dataService.loadData(true);
        }

        this.loadingSaveChanges = false;
      }, _ => {
        this.loadingSaveChanges = false;
      });
    } else {
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
    }
  }

  changeName(input: any) {
    console.log(input);
    this.projectForm.patchValue({
      seoAlias: makeSeoAlias(input)
    });
  }

  changeLanguage(event: any) {
    this.spinning = true;
    this.projectForm.markAsPristine();
    if (this.isAddNew === false) {
      forkJoin([
        this.projectService.getById(this.data.id, event),
        this.projectCategoryService.getAll(event)
      ]).subscribe((res: any) => {
        const getById = res[0];
        this.projectCategories = res[1];

        this.projectForm.patchValue({
          id: getById.id,
          categoryId: getById.categoryId,
          name: getById.name,
          description: getById.description,
          content: getById.content,
          seoPageTitle: getById.seoPageTitle,
          seoAlias: getById.seoAlias,
          seoKeywords: getById.seoKeywords,
          seoDescription: getById.seoDescription,
          createdDate: getById.createdDate,
          createdBy: getById.createdBy,
          status: getById.status
        });
        this.projectForm.markAsPristine();
        this.spinning = false;
      });
    } else {
      this.projectCategoryService.getAll(event)
        .subscribe((res: any[]) => {
          this.projectCategories = res;
          this.spinning = false;
        });
    }
  }

  destroyModal() {
    this.modal.destroy(false);
  }
}
