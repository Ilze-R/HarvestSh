import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/_models/user.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  user: User = new User();
  errorMessage: string = '';
  @Input() showComponent!: boolean;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (this.authService.currentUserValue?.id) {
      this.router.navigate(['/give-dashboard']);
    }
  }

  exit() {
    this.sharedService.showRegisterComponent = false;
  }

  register() {
    this.authService.register(this.user).subscribe(
      (data) => {
        this.router.navigate(['/give-dashboard']);
      },
      (err) => {
        if (err?.status === 409) {
          this.errorMessage = 'Username already exist.';
        } else {
          this.errorMessage = 'Unexpected error occured.';
          console.log(err);
        }
      }
    );
  }
}
