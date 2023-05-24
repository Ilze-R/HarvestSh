import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './log-reg/login/login.component';
import { GetComponent } from './give-get/get/get.component';
import { GiveComponent } from './give-get/give/give.component';
import { RegisterComponent } from './log-reg/register/register.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { GiveDashboardComponent } from './give-dashboard/give-dashboard.component';
import { GetDashboardComponent } from './get-dashboard/get-dashboard.component';
import { UnauthorizedComponent } from './error-pages/unauthorized/unauthorized.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'give', component: GiveComponent },
  { path: 'get', component: GetComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'give-dashboard', component: GiveDashboardComponent },
  { path: 'get-dashboard', component: GetDashboardComponent },
  { path: '404', component: NotFoundComponent },
  { path: '401', component: UnauthorizedComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
