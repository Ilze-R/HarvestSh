import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-give-dashboard',
  templateUrl: './give-dashboard.component.html',
  styleUrls: ['./give-dashboard.component.scss'],
})
export class GiveDashboardComponent implements OnInit {
  currentUser!: User | null;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    console.log(this.currentUser?.username + 'first');
    this.router.navigate(['/give-dashboard']);
    this.authenticationService.currentUser$.subscribe((user) => {
      console.log(JSON.stringify(user));
      this.currentUser = user;
      console.log(this.currentUser?.username + 'second');
    });
    console.log(this.currentUser?.username + 'third');
  }
}
