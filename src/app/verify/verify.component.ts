import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  Observable,
  BehaviorSubject,
  switchMap,
  map,
  startWith,
  catchError,
  of,
} from 'rxjs';
import { DataState } from '../_enum/datastate.enum';
import { VerifyState, AccountType } from '../_interface/appstates';
import { User } from '../_interface/user';
import { UserService } from '../_service/user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  verifyState$: Observable<VerifyState>;
  private userSubject = new BehaviorSubject<User>(null);
  user$ = this.userSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  private readonly ACCOUNT_KEY: string = 'key';

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.verifyState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const type: AccountType = this.getAccountType(window.location.href);
        // { path: 'user/verify/account/:key', component: VerifyComponent }
        // return this.userService.verify$(params.get('key'), type).pipe(
        return this.userService
          .verify$(params.get(this.ACCOUNT_KEY), type)
          .pipe(
            map((response) => {
              console.log(response);
              type === 'password'
                ? this.userSubject.next(response.data.user)
                : null;
              return {
                type,
                title: 'Verified!',
                dataState: DataState.LOADED,
                message: response.message,
                verifySuccess: true,
              };
            }),
            startWith({
              title: 'Verifying...',
              dataState: DataState.LOADING,
              message: 'Please wait while we verify the information',
              verifySuccess: false,
            }),
            catchError((error: string) => {
              return of({
                title: 'An error occured',
                dataState: DataState.ERROR,
                error,
                message: error,
                verifySuccess: false,
              });
            })
          );
      })
    );
  }

  renewPassword(resetPasswordForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.verifyState$ = this.userService
      .renewPassword$({
        userId: this.userSubject.value.id,
        password: resetPasswordForm.value.password,
        confirmedPassword: resetPasswordForm.value.confirmedPassword,
      })
      .pipe(
        map((response) => {
          console.log(response);
          this.isLoadingSubject.next(false);
          return {
            type: 'account' as AccountType,
            title: 'Success',
            dataState: DataState.LOADED,
            message: response.message,
            verifySuccess: true,
          };
        }),
        startWith({
          type: 'password' as AccountType,
          title: 'Verified!',
          dataState: DataState.LOADED,
          verifySuccess: false,
        }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({
            type: 'password' as AccountType,
            title: 'Verified!',
            dataState: DataState.LOADED,
            error,
            verifySuccess: true,
          });
        })
      );
  }

  private getAccountType(url: string): AccountType {
    return url.includes('password') ? 'password' : 'account';
  }
}
