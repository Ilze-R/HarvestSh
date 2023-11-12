import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, of, map, startWith, catchError } from 'rxjs';
import { DataState } from '../_enum/datastate.enum';
import { RegisterAndResetState } from '../_interface/appstates';
import { UserService } from '../_service/user.service';
import { SharedService } from '../_service/shared.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss'],
})
export class ResetpasswordComponent {
  resetPasswordState$: Observable<RegisterAndResetState> = of({
    dataState: DataState.LOADED,
  });
  readonly DataState = DataState;

  constructor(
    private userService: UserService,
    public sharedService: SharedService
  ) {}

  resetPassword(resetPasswordForm: NgForm): void {
    this.resetPasswordState$ = this.userService
      .requestPasswordReset$(resetPasswordForm.value.email)
      .pipe(
        map((response) => {
          console.log(response);
          resetPasswordForm.reset();
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

  exit() {
    this.sharedService.showLoginComponent = false;
    this.sharedService.showRegisterComponent = false;
  }
}
