import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-give-dashboard',
  templateUrl: './give-dashboard.component.html',
  styleUrls: ['./give-dashboard.component.scss'],
})
export class GiveDashboardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(['/give-dashboard']);
  }
}
