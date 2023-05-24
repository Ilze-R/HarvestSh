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
import { FooterComponent } from './footer/footer.component';
import { IncrementCounterComponent } from './increment-counter/increment-counter.component';
import { GetDashboardComponent } from './get-dashboard/get-dashboard.component';
import { GiveDashboardComponent } from './give-dashboard/give-dashboard.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { UnauthorizedComponent } from './error-pages/unauthorized/unauthorized.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    GetDashboardComponent,
    GiveDashboardComponent,
    NotFoundComponent,
    UnauthorizedComponent,
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
