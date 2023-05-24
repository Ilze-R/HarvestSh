import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from '../_models/user.model';
import { HomeComponent } from '../home/home.component';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  isLoggedIn = false;
  user: User = new User();

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.authService.loggedUser.subscribe((res) => {
      if (res) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    // this.router.navigate(['']);
    this.isLoggedIn = false;
    // location.reload();
  }

  showLogin() {
    this.sharedService.showLoginComponent = true;
  }
}
