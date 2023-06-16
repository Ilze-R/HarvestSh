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
    this.sharedService.cretaAccount = false;
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
          }
          if (err === 'Email already exists') {
            this.registerForm.get('email')?.setErrors({ emailExists: true });
          }
          if (err === 'Username already exists') {
            this.registerForm
              .get('username')
              ?.setErrors({ usernameExists: true });
          } else {
            this.errorMessage = 'Unexpected error occured.';
            console.log(err);
          }
        }
      );
    }
  }
  alreadyAccount() {
    // this.sharedService.cretaAccount = false;
    // this.sharedService.showLoginComponent = true;
    this.sharedService.showRegisterComponent = false;
    this.sharedService.cretaAccount = false;
  }
}
