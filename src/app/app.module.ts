import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IconsProviderModule } from './icons-provider.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OnlineStatusModule } from 'ngx-online-status';
import { SharedModule } from './shared/modules/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { vi_VN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import * as fromComponents from './shared/components/index';
import { EnvServiceProvider } from './env.service.provider';
import { SessionConstant } from './shared/constants/session.constant';
import { ErrorInterceptor } from './shared/errors/error.interceptor';

registerLocaleData(vi);

export function tokenGetter() {
  return localStorage.getItem(SessionConstant.TOKEN);
}

@NgModule({
  declarations: [
    AppComponent,
    AppRoutingModule.components,
    fromComponents.components
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxSpinnerModule,
    OnlineStatusModule,
    SharedModule,
    IconsProviderModule,
    JwtModule.forRoot({
      config: {
        skipWhenExpired: true,
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:4200"]
      },
    }),
  ],
  providers: [
    { provide: NZ_I18N, useValue: vi_VN },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    EnvServiceProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
