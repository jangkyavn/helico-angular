import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FileService } from 'src/app/shared/services/file.service';
import { MessageConstant } from 'src/app/shared/constants/message.constant';
import { SystemConstant } from 'src/app/shared/constants/system.constant';
import { DataService } from 'src/app/shared/services/data.service';
import { checkExtension, checkFileSize } from 'src/app/shared/functions/utilities.function';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  setReverse = false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  validFileExtensions = ['.jpg', '.jpeg', '.bmp', '.gif', '.png', '.JPG', '.JPGE', '.BMP', '.GIF', '.PNG'];
  avatar: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setResize();
  }

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private messageService: MessageService,
    private uploadService: UploadService,
    private fileService: FileService,
    private dataService: DataService
  ) { }

  setResize() {
    if (window.innerWidth < 992) {
      this.setReverse = true;
    } else {
      this.setReverse = false;
    }
  }
  ngOnInit() {
    this.setResize();
    this.getAvatar();
  }

  importFile(event: any) {
    const files = event.target.files;
    if (files && files[0]) {
      if (!checkExtension(event.target.files[0].name, this.validFileExtensions)) {
        this.messageService.error('File không hợp lệ.');
        return;
      }

      if (!checkFileSize(event.target.files[0].size)) {
        this.messageService.error('Dung lượng file vượt quá 2MB.');
        return;
      }

      const formData = new FormData();
      formData.append('file', files[0]);
      this.uploadService.uploadFile(formData, 'images', 'avatars')
        .subscribe(res => {
          const user = this.authService.getUser();
          user.avatar = res.fileName;
          this.authService.setUser(user);
          this.userService.updateAvatar({
            id: user.nameid,
            avatar: user.avatar
          }).subscribe((resUpdateAvatar: any) => {
            if (resUpdateAvatar) {
              this.getAvatar();
              this.messageService.success(MessageConstant.UPDATE_AVATAR_OK);
              this.dataService.updateAvatar(true);
            }
          });
        });
    }
  }

  getAvatar() {
    if (this.authService.getUser()?.avatar) {
      this.fileService.getFile(SystemConstant.FOLDER_AVATAR + this.authService.getUser()?.avatar)
        .subscribe((res: any) => {
          console.log(res);
          if (res) {
            this.avatar = res.changingThisBreaksApplicationSecurity;
          }
        });
    }
  }
}
