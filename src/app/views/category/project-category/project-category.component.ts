import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent, NzTableQueryParams, NzModalService } from 'ng-zorro-antd';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/heplers/paging.param';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MessageService } from 'src/app/shared/services/message.service';
import { User } from 'src/app/shared/models/user.model';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { SystemConstant } from 'src/app/shared/constants/system.constant';
import { ProjectCategoryAddEditModalComponent } from './modals/project-category-add-edit-modal/project-category-add-edit-modal.component';
import { ProjectCategoryService } from 'src/app/shared/services/project-category.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-project-category',
  templateUrl: './project-category.component.html',
  styleUrls: ['./project-category.component.scss']
})
export class ProjectCategoryComponent implements OnInit, OnDestroy {
  listOfData: any[] = [];
  loading = false;
  isFirstLoad = true;
  languages: any[] = [];
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: -1
  };
  loadDataSub: Subscription;
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: '',
    searchKey: '',
    searchValue: '',
    languageId: 'vi'
  };

  constructor(
    private modalService: NzModalService,
    private nzContextMenuService: NzContextMenuService,
    private projectCategoryService: ProjectCategoryService,
    private messageService: MessageService,
    private languageService: LanguageService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getAllLanguages(() => {
      this.pagingParams.languageId = this.languages.filter(x => x.isDefault === true)[0].id;
      this.loadData();
    });

    this.loadDataSub = this.dataService.loadData$
      .subscribe((res: boolean) => {
        if (res) {
          this.loadData();
        }
      });
  }

  ngOnDestroy() {
    this.loadDataSub.unsubscribe();
  }

  loadData(reset: boolean = false): void {
    if (reset) {
      this.pagination.currentPage = 1;
    }
    this.loading = true;
    this.projectCategoryService.getAllPaging(
      this.pagination.currentPage || 1,
      this.pagination.itemsPerPage || SystemConstant.PAGE_SIZE,
      this.pagingParams)
      .subscribe((res: PaginatedResult<User[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.listOfData = res.result;

        if (this.listOfData.length === 0 && this.pagination.currentPage !== 1) {
          this.pagination.currentPage -= 1;
          this.loadData();
        }
      });
  }

  getAllLanguages(callback: () => any) {
    this.languageService.getAll()
      .subscribe((res: any[]) => {
        this.languages = res;
        callback();
      });
  }

  create() {
    const modal = this.modalService.create({
      nzTitle: 'Thêm mới loại dự án',
      nzContent: ProjectCategoryAddEditModalComponent,
      nzStyle: {
        top: SystemConstant.MODAL_TOP
      },
      nzBodyStyle: {
        padding: SystemConstant.MODAL_BODY_PADDING
      },
      nzMaskClosable: false,
      nzClosable: true,
      nzComponentParams: {
        data: {},
        isAddNew: true,
        selectedLanguage: this.pagingParams.languageId
      }
    });

    modal.afterClose.subscribe((result: boolean) => {
      if (result) {
        this.loadData();
      }
    });
  }

  update(data: User) {
    this.projectCategoryService.getById(data.id, this.pagingParams.languageId)
      .subscribe((res: User) => {
        const modal = this.modalService.create({
          nzTitle: 'Cập nhật loại dự án',
          nzContent: ProjectCategoryAddEditModalComponent,
          nzStyle: {
            top: SystemConstant.MODAL_TOP
          },
          nzBodyStyle: {
            padding: SystemConstant.MODAL_BODY_PADDING
          },
          nzMaskClosable: false,
          nzClosable: true,
          nzComponentParams: {
            data: res,
            isAddNew: false
          }
        });

        modal.afterClose.subscribe((result: boolean) => {
          if (result) {
            this.loadData();
          }
        });
      });
  }

  delete(id: any) {
    this.messageService.confirm(MessageConstant.CONFIRM_DELETE_MSG, () => {
      this.projectCategoryService.delete(id).subscribe((res: boolean) => {
        if (res) {
          this.messageService.success(MessageConstant.DELETED_OK_MSG);
          this.loadData();
        }
      });
    }, 'danger');
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    if (this.isFirstLoad) {
      return;
    }
    this.isFirstLoad = false;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find(item => item.value !== null);
    this.pagingParams.sortKey = (currentSort && currentSort.key) || '';
    this.pagingParams.sortValue = (currentSort && currentSort.value) || '';
    this.pagination.currentPage = pageIndex;
    this.pagination.itemsPerPage = pageSize;
    this.loadData();
  }

  search(keyword: string) {
    this.pagingParams.keyword = keyword;
    this.loadData(true);
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  changeLanguage(event: any) {
    this.pagingParams.languageId = event;
    this.loadData();
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
    this.projectCategoryService.ChangePosition(this.listOfData)
      .subscribe((res: any) => {
        if (res) {
          this.messageService.success(MessageConstant.UPDATE_POSITION_OK_MSG);
        }
      });
  }
}
