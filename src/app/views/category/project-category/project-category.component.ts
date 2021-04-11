import { Component, OnInit } from '@angular/core';
import { PagingParams } from 'src/app/shared/heplers/paging.param';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MessageService } from 'src/app/shared/services/message.service';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { SystemConstant } from 'src/app/shared/constants/system.constant';
import { ProjectCategoryAddEditModalComponent } from './modals/project-category-add-edit-modal/project-category-add-edit-modal.component';
import { ProjectCategoryService } from 'src/app/shared/services/project-category.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-project-category',
  templateUrl: './project-category.component.html',
  styleUrls: ['./project-category.component.scss']
})
export class ProjectCategoryComponent implements OnInit {
  listOfData: any[] = [];
  loading = false;
  isFirstLoad = true;
  languages: any[] = [];
  totalCount = 0;
  totalPages = 0;
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: '',
    searchKey: '',
    searchValue: '',
    languageId: 'vi',
    pageNumber: 1,
    pageSize: 100
  };

  constructor(
    private modalService: NzModalService,
    private nzContextMenuService: NzContextMenuService,
    private projectCategoryService: ProjectCategoryService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  loadData(reset: boolean = false): void {
    if (reset) {
      this.pagingParams.pageNumber = 1;
    }
    this.loading = true;
    this.projectCategoryService.getAllPaging(this.pagingParams)
      .subscribe((res: any) => {
        this.loading = false;

        this.totalPages = res.totalPages;
        this.totalCount = res.totalCount;
        this.pagingParams.pageNumber = res.currentPage;
        this.listOfData = res.items;

        if (this.listOfData.length === 0 && this.pagingParams.pageNumber !== 1) {
          this.pagingParams.pageNumber -= 1;
          this.loadData();
        }
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
        isAddNew: true
      }
    });

    modal.afterClose.subscribe((result: boolean) => {
      if (result) {
        this.loadData();
      }
    });
  }

  update(data: any) {
    this.projectCategoryService.getById(data.id, this.pagingParams.languageId)
      .subscribe((res: any) => {
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
    // if (this.isFirstLoad) {
    //   this.isFirstLoad = false;
    //   return;
    // }
    // const { pageSize, pageIndex, sort } = params;
    // const currentSort = sort.find(item => item.value !== null);
    // this.pagingParams.sortKey = (currentSort && currentSort.key) || '';
    // this.pagingParams.sortValue = (currentSort && currentSort.value) || '';
    // this.pagination.currentPage = pageIndex;
    // this.pagination.itemsPerPage = pageSize;
    // this.loadData();
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
