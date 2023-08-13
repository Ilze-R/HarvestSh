import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, of, map, startWith, catchError } from 'rxjs';
import { DataState } from 'src/app/_enum/datastate.enum';
import { RegisterAndResetState } from 'src/app/_interface/appstates';
import { SharedService } from 'src/app/_service/shared.service';
import { UserService } from 'src/app/_service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerState$: Observable<RegisterAndResetState> = of({
    dataState: DataState.LOADED,
  });
  readonly DataState = DataState;

  constructor(
    private userService: UserService,
    public sharedService: SharedService
  ) {}

  register(registerForm: NgForm): void {
    this.registerState$ = this.userService.save$(registerForm.value).pipe(
      map((response) => {
        console.log(response);
        registerForm.reset();
        return {
          dataState: DataState.LOADED,
          registerSuccess: true,
          message: response.message,
        };
      }),
      startWith({ dataState: DataState.LOADING, registerSuccess: false }),
      catchError((error: string) => {
        return of({
          dataState: DataState.ERROR,
          registerSuccess: false,
          error,
        });
      })
    );
  }

  createAccountForm(): void {
    this.registerState$ = of({
      dataState: DataState.LOADED,
      registerSuccess: false,
    });
  }

  exit() {
    this.sharedService.showRegisterComponent = false;
    this.sharedService.showRegisterComponent = false;
  }

  goToLogin() {
    this.sharedService.showRegisterComponent = false;
    this.sharedService.showLoginComponent = true;
  }
}
