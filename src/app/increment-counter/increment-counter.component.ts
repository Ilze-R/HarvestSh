import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-increment-counter',
  templateUrl: './increment-counter.component.html',
  styleUrls: ['./increment-counter.component.scss'],
  animations: [
    trigger('counterAnimation', [
      transition(':increment', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('500ms', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class IncrementCounterComponent implements OnInit {
  user: User = new User();
  received: number = 0;
  given: number = 0;
  usersTottalFromDB: number = 0;
  usersTottal: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getUserCount().subscribe((count: number) => {
      this.usersTottalFromDB = count;

      setTimeout(() => {
        this.incrementValueReceived(50);
        this.incrementValueGiven(300);
        this.incrementValueUsersTotal(this.usersTottalFromDB);
      }, 100);
    });
  }

  // incrementValue(
  //   value: number,
  //   targetValue: number,
  //   incrementInterval: number
  // ) {
  //   const incrementTimer = setInterval(() => {
  //     this.ngZone.run(() => {
  //       value++;
  //       if (value === targetValue) {
  //         clearInterval(incrementTimer);
  //       }
  //     });
  //   }, incrementInterval);
  // }

  incrementValueReceived(targetValue: number) {
    const incrementInterval = 10; // Delay between each increment in milliseconds

    const incrementTimer = setInterval(() => {
      this.received++;
      if (this.received === targetValue) {
        clearInterval(incrementTimer);
      }
    }, incrementInterval);
  }

  incrementValueGiven(targetValue: number) {
    const incrementInterval = 0.3; // Delay between each increment in milliseconds

    const incrementTimer = setInterval(() => {
      this.given++;
      if (this.given === targetValue) {
        clearInterval(incrementTimer);
      }
    }, incrementInterval);
  }
  incrementValueUsersTotal(targetValue: number) {
    const incrementInterval = 10; // Delay between each increment in milliseconds

    const incrementTimer = setInterval(() => {
      this.usersTottal++;
      if (this.usersTottal === targetValue) {
        clearInterval(incrementTimer);
      }
    }, incrementInterval);
  }
}
