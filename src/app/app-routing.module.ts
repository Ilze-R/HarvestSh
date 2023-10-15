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
import { GardeningComponent } from './forum/gardening/gardening.component';
import { ReciepesComponent } from './forum/reciepes/reciepes.component';
import { ImadeComponent } from './forum/imade/imade.component';
import { OtherComponent } from './forum/other/other.component';
import { UGardeningpostComponent } from './u-gardeningpost/u-gardeningpost.component';
import { URecipepostComponent } from './u-recipepost/u-recipepost.component';
import { UOtherpostComponent } from './u-otherpost/u-otherpost.component';
import { UImadepostComponent } from './u-imadepost/u-imadepost.component';
import { AccountComponent } from './account/account.component';

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
  { path: 'account', component: AccountComponent },
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
    path: 'newgardeningpost',
    component: UGardeningpostComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'newrecipepost',
    component: URecipepostComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'newotherpost',
    component: UOtherpostComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'newimadepost',
    component: UImadepostComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'forum/gardening',
    component: GardeningComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'forum/recipes',
    component: ReciepesComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'forum/imade',
    component: ImadeComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'forum/other',
    component: OtherComponent,
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
