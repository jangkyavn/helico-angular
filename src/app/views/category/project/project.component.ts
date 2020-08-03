import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent, NzTableQueryParams, NzModalService } from 'ng-zorro-antd';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/heplers/paging.param';
import { MessageService } from 'src/app/shared/services/message.service';
import { User } from 'src/app/shared/models/user.model';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { SystemConstant } from 'src/app/shared/constants/system.constant';
import { ProjectAddEditModalComponent } from './modals/project-add-edit-modal/project-add-edit-modal.component';
import { ProjectService } from 'src/app/shared/services/project.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
  listOfData: any[] = [];
  loading = false;
  isFirstLoad = true;
  languages: any[] = [];
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 10
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
    private projectService: ProjectService,
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
    this.projectService.getAllPaging(
      this.pagination.currentPage || 1,
      this.pagination.itemsPerPage || SystemConstant.PAGE_SIZE,
      this.pagingParams)
      .subscribe((res: PaginatedResult<any[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.listOfData = res.result;

        console.log(res.result[0].imageBase64);

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
      nzTitle: 'Thêm mới dự án',
      nzContent: ProjectAddEditModalComponent,
      nzStyle: {
        top: SystemConstant.MODAL_TOP
      },
      nzBodyStyle: {
        padding: SystemConstant.MODAL_BODY_PADDING
      },
      nzWidth: 1200,
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
    this.projectService.getById(data.id, this.pagingParams.languageId)
      .subscribe((res: User) => {
        const modal = this.modalService.create({
          nzTitle: 'Cập nhật dự án',
          nzContent: ProjectAddEditModalComponent,
          nzStyle: {
            top: SystemConstant.MODAL_TOP
          },
          nzBodyStyle: {
            padding: SystemConstant.MODAL_BODY_PADDING
          },
          nzWidth: 1200,
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
      this.projectService.delete(id).subscribe((res: boolean) => {
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
}
