import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapDemoComponent } from './map-demo/map-demo.component';
import {
  HttpClientModule,
  HttpClientJsonpModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { IncrementCounterComponent } from './increment-counter/increment-counter.component';
import { GetComponent } from './give-get/get/get.component';
import { GiveComponent } from './give-get/give/give.component';
import { FooterComponent } from './footer/footer.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { UnauthorizedComponent } from './error-pages/unauthorized/unauthorized.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './log-reg/login/login.component';
import { RegisterComponent } from './log-reg/register/register.component';
import { NavComponent } from './nav/nav.component';
import { DashboardComponent } from './dash/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CacheInterceptor } from './interceptor/cache.interceptor';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { VerifyComponent } from './verify/verify.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ProfileComponent } from './profile/profile.component';
import { UGiveComponent } from './u-give/u-give.component';
import { GiveViewComponent } from './give-view/give-view.component';
import { DeleteWarnComponent } from './warnings/delete-warn/delete-warn.component';
import { MatDialogModule } from '@angular/material/dialog';
import { GoogleMapsModule } from '@angular/google-maps';
import { GardeningComponent } from './forum/gardening/gardening.component';
import { ReciepesComponent } from './forum/reciepes/reciepes.component';
import { ImadeComponent } from './forum/imade/imade.component';
import { OtherComponent } from './forum/other/other.component';
import { UGardeningpostComponent } from './u-gardeningpost/u-gardeningpost.component';
import { URecipepostComponent } from './u-recipepost/u-recipepost.component';
import { UImadepostComponent } from './u-imadepost/u-imadepost.component';
import { UOtherpostComponent } from './u-otherpost/u-otherpost.component';

@NgModule({
  declarations: [
    AppComponent,
    MapDemoComponent,
    HomeComponent,
    IncrementCounterComponent,
    GetComponent,
    GiveComponent,
    FooterComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    AboutComponent,
    LoginComponent,
    RegisterComponent,
    NavComponent,
    DashboardComponent,
    VerifyComponent,
    ResetpasswordComponent,
    ProfileComponent,
    UGiveComponent,
    GiveViewComponent,
    DeleteWarnComponent,
    GardeningComponent,
    ReciepesComponent,
    ImadeComponent,
    OtherComponent,
    UGardeningpostComponent,
    URecipepostComponent,
    UImadepostComponent,
    UOtherpostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [DeleteWarnComponent],
})
export class AppModule {}
