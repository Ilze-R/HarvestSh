import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AboutComponent } from './about/about.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './log-reg/login/login.component';
import { RouterModule } from '@angular/router';
import { GiveComponent } from './give-get/give/give.component';
import { GetComponent } from './give-get/get/get.component';
import { RegisterComponent } from './log-reg/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    AboutComponent,
    LoginComponent,
    GiveComponent,
    GetComponent,
    RegisterComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, RouterModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
