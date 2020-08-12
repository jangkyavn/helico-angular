import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent, NzTableQueryParams, NzModalService } from 'ng-zorro-antd';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/heplers/paging.param';
import { MessageService } from 'src/app/shared/services/message.service';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { SystemConstant } from 'src/app/shared/constants/system.constant';
import { SlideAddEditModalComponent } from './modals/slide-add-edit-modal/slide-add-edit-modal.component';
import { SlideService } from 'src/app/shared/services/slide.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent implements OnInit, OnDestroy {
  listOfData: any[] = [];
  loading = false;
  isFirstLoad = true;
  languages: any[] = [];
  loadDataSub: Subscription;
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: '',
    searchKey: '',
    searchValue: '',
    languageId: 'vn'
  };

  constructor(
    private modalService: NzModalService,
    private nzContextMenuService: NzContextMenuService,
    private slideService: SlideService,
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

  loadData(): void {
    this.loading = true;
    this.slideService.getAll().subscribe((res: any[]) => {
      this.loading = false;
      this.listOfData = res;

      console.log(res);
    });
  }

  create() {
    const modal = this.modalService.create({
      nzTitle: 'Thêm mới slide ảnh',
      nzContent: SlideAddEditModalComponent,
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
    // this.slideService.getById(data.id)
    //   .subscribe((res: any) => {
    //     const modal = this.modalService.create({
    //       nzTitle: 'Cập nhật slide ảnh',
    //       nzContent: SlideAddEditModalComponent,
    //       nzStyle: {
    //         top: SystemConstant.MODAL_TOP
    //       },
    //       nzBodyStyle: {
    //         padding: SystemConstant.MODAL_BODY_PADDING
    //       },
    //       nzWidth: 1200,
    //       nzMaskClosable: false,
    //       nzClosable: true,
    //       nzComponentParams: {
    //         data: res,
    //         isAddNew: false,
    //         selectedLanguage: this.pagingParams.languageId
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
      this.slideService.delete(id).subscribe((res: boolean) => {
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
    this.loadData();
  }

  search(keyword: string) {
    this.pagingParams.keyword = keyword;
    this.loadData();
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  changeLanguage(event: any) {
    this.pagingParams.languageId = event;
  }
}
