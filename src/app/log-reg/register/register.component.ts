import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/_models/user.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SharedService } from 'src/app/_services/shared.service';

const fb = new FormBuilder();

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

  registerForm = fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.authService.currentUserValue?.id) {
      this.router.navigate(['/give-dashboard']);
    }
  }

  exit() {
    this.sharedService.showRegisterComponent = false;
  }

  register() {
    if (this.registerForm.valid) {
      const username = this.registerForm.get('username')?.value;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;
      this.user.username = username;
      this.user.email = email;
      this.user.password = password;
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
}
