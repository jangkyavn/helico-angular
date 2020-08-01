import { Component, OnInit } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent, NzTableQueryParams, NzModalService } from 'ng-zorro-antd';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/heplers/paging.param';
import { UserService } from 'src/app/shared/services/user.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { User } from 'src/app/shared/models/user.model';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { SystemConstant } from 'src/app/shared/constants/system.constant';
import { ProductCategoryAddEditModalComponent } from './modals/product-category-add-edit-modal/product-category-add-edit-modal.component';
import { ProductCategoryService } from 'src/app/shared/services/product-category.service';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {
  listOfData: any[] = [];
  loading = false;
  isFirstLoad = true;
  languages: any[] = [];
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 10
  };
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
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getAllLanguages(() => {
      this.pagingParams.languageId = this.languages.filter(x => x.isDefault === true)[0].id;
      this.loadData();
    });
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

  update(data: User) {
    // this.productCategoryService.getById(data.id)
    //   .subscribe((res: User) => {
    //     const modal = this.modalService.create({
    //       nzTitle: 'Cập nhật loại sản phẩm',
    //       nzContent: ProductCategoryAddEditModalComponent,
    //       nzStyle: {
    //         top: SystemConstant.MODAL_TOP
    //       },
    //       nzBodyStyle: {
    //         padding: SystemConstant.MODAL_BODY_PADDING
    //       },
    //       nzMaskClosable: false,
    //       nzClosable: true,
    //       nzComponentParams: {
    //         data: res,
    //         isAddNew: false
    //       }
    //     });

    //     modal.afterClose.subscribe((result: boolean) => {
    //       if (result) {
    //         this.loadData();
    //       }
    //     });
    //   });
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
}
