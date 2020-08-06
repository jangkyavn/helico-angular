import { Component, OnInit } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent, NzTableQueryParams, NzModalService } from 'ng-zorro-antd';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/heplers/paging.param';
import { UserService } from 'src/app/shared/services/user.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { User } from 'src/app/shared/models/user.model';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { SystemConstant } from 'src/app/shared/constants/system.constant';
import { UserAddEditModalComponent } from './modals/user-add-edit-modal/user-add-edit-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  listOfData: User[] = [];
  loading = true;
  isFirstLoad = true;
  pagination: Pagination = {};
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: '',
    searchKey: '',
    searchValue: ''
  };

  constructor(
    private modalService: NzModalService,
    private nzContextMenuService: NzContextMenuService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  getRoleNames(data: User) {
    return data.roles.map(x => x.name).toString();
  }

  loadData(reset: boolean = false): void {
    if (reset) {
      this.pagination.currentPage = 1;
    }
    this.loading = true;
    this.userService.getAllPaging(
      this.pagination.currentPage || 1,
      this.pagination.itemsPerPage || SystemConstant.PAGE_SIZE,
      this.pagingParams)
      .subscribe((res: PaginatedResult<User[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.listOfData = res.result;

        console.log(this.listOfData);

        if (this.listOfData.length === 0 && this.pagination.currentPage !== 1) {
          this.pagination.currentPage -= 1;
          this.loadData();
        }
      });
  }

  create() {
    const modal = this.modalService.create({
      nzTitle: 'Thêm mới người dùng',
      nzContent: UserAddEditModalComponent,
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

  update(data: User) {
    this.userService.getById(data.id)
      .subscribe((res: User) => {
        const modal = this.modalService.create({
          nzTitle: 'Cập nhật người dùng',
          nzContent: UserAddEditModalComponent,
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
      this.userService.delete(id).subscribe((res: boolean) => {
        if (res) {
          this.messageService.success(MessageConstant.DELETED_OK_MSG);
          this.loadData();
        }
      });
    }, 'danger');
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      return;
    }
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

  changeStatus(data: User) {
    this.userService.changeStatus({ id: data.id })
      .subscribe((res: any) => {
        if (res) {
          this.messageService.success(MessageConstant.UPDATE_STATUS_OK);
        }
      });
  }
}
