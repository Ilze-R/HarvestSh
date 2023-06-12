import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../app/_services/authentication.service';
import { User } from '../../app/_models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser!: User | null;
  currentUserr? = '';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  // ngOnInit(): void {
  //   console.log(this.currentUser?.username + 'first');

  //   this.router.navigate(['/give-dashboard']);
  //   this.authenticationService.currentUser$.subscribe((user) => {
  //     console.log(JSON.stringify(user));
  //     this.currentUser = user;
  //   });
  // }
  ngOnInit(): void {
    this.authenticationService.currentUser$.subscribe((user) => {
      console.log(JSON.stringify(user));
      this.currentUser = user;

      console.log(this.currentUser?.username + 'first');

      this.router.navigate(['/dashboard']);
    });
  }
}
