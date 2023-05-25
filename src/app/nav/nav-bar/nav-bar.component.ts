import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { User } from 'src/app/_models/user.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  isLoggedIn = false;
  user: User = new User();

  constructor(
    private authService: AuthenticationService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.sharedService.showLoginComponent = false;
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
  }

  showLogin() {
    this.sharedService.showLoginComponent = true;
  }
}
