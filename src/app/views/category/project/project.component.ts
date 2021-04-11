import { Component, OnInit, } from '@angular/core';
import { PagingParams } from 'src/app/shared/heplers/paging.param';
import { MessageService } from 'src/app/shared/services/message.service';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { SystemConstant } from 'src/app/shared/constants/system.constant';
import { ProjectAddEditModalComponent } from './modals/project-add-edit-modal/project-add-edit-modal.component';
import { ProjectService } from 'src/app/shared/services/project.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
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
    private projectService: ProjectService,
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
    this.projectService.getAllPaging(this.pagingParams)
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
    this.projectService.getById(data.id)
      .subscribe((res: any) => {
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
}
