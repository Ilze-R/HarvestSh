import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapDemoComponent } from './map-demo/map-demo.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { UnauthorizedComponent } from './error-pages/unauthorized/unauthorized.component';
import { GetComponent } from './give-get/get/get.component';
import { GiveComponent } from './give-get/give/give.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './log-reg/login/login.component';
import { RegisterComponent } from './log-reg/register/register.component';
import { DashboardComponent } from './dash/dashboard/dashboard.component';
import { AuthenticationGuard } from './_guard/authentication.guard';
import { VerifyComponent } from './verify/verify.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ProfileComponent } from './profile/profile.component';
import { UGiveComponent } from './u-give/u-give.component';
import { GiveViewComponent } from './give-view/give-view.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'login', component: HomeComponent },
  { path: 'register', component: HomeComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  { path: 'user/verify/account/:key', component: VerifyComponent },
  { path: 'user/verify/password/:key', component: VerifyComponent },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'give',
    component: GiveComponent,
  },
  { path: 'get', component: GetComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'gives',
    component: UGiveComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'give/:id',
    component: GiveViewComponent,
    canActivate: [AuthenticationGuard],
  },
  { path: '404', component: NotFoundComponent },
  { path: '401', component: UnauthorizedComponent },
  // { path: '', component: HomeComponent, canActivate: [AuthenticationGuard] },
  { path: '', component: HomeComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
