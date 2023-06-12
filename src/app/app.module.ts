import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavBarComponent } from './nav/nav-bar/nav-bar.component';
import { AboutComponent } from './about/about.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './log-reg/login/login.component';
import { RouterModule } from '@angular/router';
import { GiveComponent } from './give-get/give/give.component';
import { GetComponent } from './give-get/get/get.component';
import { RegisterComponent } from './log-reg/register/register.component';
import { FooterComponent } from './footer/footer.component';
import { IncrementCounterComponent } from './increment-counter/increment-counter.component';
import { DashboardComponent } from '../dash/dashboard-all/dashboard.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { UnauthorizedComponent } from './error-pages/unauthorized/unauthorized.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SettingsComponent } from '../dash/settings/settings.component';
import { ActivityComponent } from '../dash/activity/activity.component';
import { MessagesComponent } from '../dash/messages/messages.component';
import { DashHomeComponent } from '../dash/dash-home/dash-home.component';

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
    FooterComponent,
    IncrementCounterComponent,
    DashboardComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    SettingsComponent,
    ActivityComponent,
    MessagesComponent,
    DashHomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
