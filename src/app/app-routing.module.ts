import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './log-reg/login/login.component';
import { GetComponent } from './give-get/get/get.component';
import { GiveComponent } from './give-get/give/give.component';
import { RegisterComponent } from './log-reg/register/register.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { DashboardComponent } from '../dash/dashboard-all/dashboard.component';
import { UnauthorizedComponent } from './error-pages/unauthorized/unauthorized.component';
import { DashHomeComponent } from '../dash/dash-home/dash-home.component';
import { SettingsComponent } from '../dash/settings/settings.component';
import { ActivityComponent } from '../dash/activity/activity.component';
import { MessagesComponent } from '../dash/messages/messages.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'give', component: GiveComponent },
  { path: 'get', component: GetComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'logged-home', component: DashHomeComponent },
  { path: 'logged-settings', component: SettingsComponent },
  { path: 'logged-activity', component: ActivityComponent },
  { path: 'logged-messages', component: MessagesComponent },

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
