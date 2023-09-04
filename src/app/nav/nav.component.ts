import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../_service/shared.service';
import { User } from '../_interface/user';
import { Router } from '@angular/router';
import { UserService } from '../_service/user.service';
import { Observable } from 'rxjs';
import { DataState } from '../_enum/datastate.enum';
import { LoginState } from '../_interface/appstates';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  @Input() user: User;
  loginState$: Observable<LoginState>;
  readonly DataState = DataState;
  isLoggedIn: boolean;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (
      localStorage.getItem('[KEY] TOKEN') != null ||
      localStorage.getItem('[REFRESH] REFRESH_TOKEN') != null
    ) {
      this.isLoggedIn = true;
    }
  }

  showLogin() {
    this.sharedService.showLoginComponent = true;
  }

  logOut(): void {
    this.userService.logOut();
    this.router.navigate(['/home']);
    this.isLoggedIn = false;
    this.sharedService.showLoginComponent = false;
  }
}
