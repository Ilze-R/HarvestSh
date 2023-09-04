import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/_service/shared.service';
import { UserService } from 'src/app/_service/user.service';

@Component({
  selector: 'app-gardening',
  templateUrl: './gardening.component.html',
  styleUrls: ['./gardening.component.scss'],
})
export class GardeningComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    public sharedService: SharedService
  ) {}

  newGardeningPostForm(): void {
    this.router.navigate(['/newgardeningpost']);
  }
}
