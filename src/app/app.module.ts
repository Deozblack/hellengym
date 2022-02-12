import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//cambiar el locale de la app
import localeMX from '@angular/common/locales/es-MX';
import {registerLocaleData} from '@angular/common';
registerLocaleData(localeMX);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    {provide: DEFAULT_CURRENCY_CODE, useValue: 'MXN '}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
