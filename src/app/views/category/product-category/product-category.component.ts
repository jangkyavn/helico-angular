import { Component, OnInit, OnDestroy } from '@angular/core';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/heplers/paging.param';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MessageService } from 'src/app/shared/services/message.service';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { SystemConstant } from 'src/app/shared/constants/system.constant';
import { ProductCategoryAddEditModalComponent } from './modals/product-category-add-edit-modal/product-category-add-edit-modal.component';
import { ProductCategoryService } from 'src/app/shared/services/product-category.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit, OnDestroy {
  listOfData: any[] = [];
  loading: boolean;
  isFirstLoad = true;
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
    private productCategoryService: ProductCategoryService,
    private messageService: MessageService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadData();

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
    this.productCategoryService.getAllPaging(
      this.pagination.currentPage || 1,
      this.pagination.itemsPerPage || SystemConstant.PAGE_SIZE,
      this.pagingParams)
      .subscribe((res: PaginatedResult<any[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.listOfData = res.result;

        if (this.listOfData.length === 0 && this.pagination.currentPage !== 1) {
          this.pagination.currentPage -= 1;
          this.loadData();
        }
      });
  }

  create() {
    const modal = this.modalService.create({
      nzTitle: 'Thêm mới loại sản phẩm',
      nzContent: ProductCategoryAddEditModalComponent,
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
    this.productCategoryService.getById(data.id)
      .subscribe((res: any) => {
        const modal = this.modalService.create({
          nzTitle: 'Cập nhật loại sản phẩm',
          nzContent: ProductCategoryAddEditModalComponent,
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
      this.productCategoryService.delete(id).subscribe((res: boolean) => {
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
    // console.log('aaa');
    // this.loadData();
  }

  search(keyword: string) {
    this.pagingParams.keyword = keyword;
    this.loadData(true);
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
    this.productCategoryService.ChangePosition(this.listOfData)
      .subscribe((res: any) => {
        if (res) {
          this.messageService.success(MessageConstant.UPDATE_POSITION_OK_MSG);
        }
      });
  }
}
