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

export function jwtOptionsFactory() {
  return {
    tokenGetter,
    skipWhenExpired: true,
    whitelistedDomains,
    blacklistedRoutes
  };
}

export const whitelistedDomains = [
  new RegExp('localhost:?[0-9]*'),
  new RegExp('([a-zA-Z0-9-_]+\.)dvbk+\.vn$'),
  new RegExp('([a-zA-Z0-9-_]+\.)pmbk+\.vn$')
] as RegExp[];
export const blacklistedRoutes = [
  new RegExp('localhost:?[0-9]*\/api\/auth'),
  new RegExp('([a-zA-Z0-9-_]+\.)dvbk+\.vn\/api\/auth$'),
  new RegExp('([a-zA-Z0-9-_]+\.)pmbk+\.vn\/api\/auth$')
] as RegExp[];

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
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    })
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
