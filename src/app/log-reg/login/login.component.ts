import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models/user.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SharedService } from 'src/app/_services/shared.service';

const fb = new FormBuilder();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: User = new User();
  errorMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    public sharedService: SharedService
  ) {}

  loginForm = fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.authService.currentUserValue?.id) {
      this.router.navigate(['/give-dashboard']);
      // location.reload();
    }
  }

  exit() {
    this.sharedService.showLoginComponent = false;
  }

  login() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      this.user.username = username;
      this.user.password = password;
      this.authService.login(this.user).subscribe(
        (data) => {
          console.log('sign in pushed');
          this.router.navigate(['/give-dashboard']);
          // location.reload();
        },
        (err) => {
          if (err.status === 403) {
            this.loginForm.setErrors({ wrongCredentials: true });
          } else {
            this.errorMessage = 'An error occurred during login.';
          }
          console.log(err);
        }
      );
    }
  }
}
