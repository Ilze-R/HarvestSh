import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Key } from '../_enum/key.enum';
import {
  CustomHttpResponse,
  Profile,
  AccountType,
} from '../_interface/appstates';
import { User } from '../_interface/user';
import { Give } from '../_interface/give';
import { GardeningPost } from '../_interface/gardeningost';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly server: string = 'http://localhost:8080';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  login$ = (email: string, password: string) =>
    <Observable<CustomHttpResponse<Profile>>>this.http
      .post<CustomHttpResponse<Profile>>(`${this.server}/user/login`, {
        email,
        password,
      })
      .pipe(tap(console.log), catchError(this.handleError));

  requestPasswordReset$ = (email: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(
          `${this.server}/user/resetpassword/${email}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  save$ = (user: User) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .post<CustomHttpResponse<Profile>>(`${this.server}/user/register`, user)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  verifyCode$ = (email: string, code: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(
          `${this.server}/user/verify/code/${email}/${code}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  verify$ = (key: string, type: AccountType) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(
          `${this.server}/user/verify/${type}/${key}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  renewPassword$ = (form: {
    userId: number;
    password: string;
    confirmedPassword: string;
  }) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .put<CustomHttpResponse<Profile>>(
          `${this.server}/user/new/password`,
          form
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  profile$ = () =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(`${this.server}/user/profile`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  update$ = (user: User) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(`${this.server}/user/update`, user)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  refreshToken$ = () => <Observable<CustomHttpResponse<Profile>>>this.http
      .get<CustomHttpResponse<Profile>>(`${this.server}/user/refresh/token`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(Key.REFRESH_TOKEN)}`,
        },
      })
      .pipe(
        tap((response) => {
          console.log(response);
          localStorage.removeItem(Key.TOKEN);
          localStorage.removeItem(Key.REFRESH_TOKEN);
          localStorage.setItem(Key.TOKEN, response.data.access_token);
          localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
        }),
        catchError(this.handleError)
      );

  updatePassword$ = (form: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/user/update/password`,
          form
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  updateRoles$ = (roleName: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/user/update/role/${roleName}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  updateAccountSettings$ = (settings: {
    enabled: boolean;
    notLocked: boolean;
  }) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/user/update/settings`,
          settings,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  toggleMfa$ = () =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(`${this.server}/user/togglemfa`, {})
        .pipe(tap(console.log), catchError(this.handleError))
    );

  updateImage$ = (formData: FormData) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/user/update/image`,
          formData
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  giveImage$ = (formData: FormData) =>
    <Observable<CustomHttpResponse<Profile & Give>>>(
      this.http
        .patch<CustomHttpResponse<Profile & Give>>(
          `${this.server}/user/give/image`,
          formData
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  logOut() {
    localStorage.removeItem(Key.TOKEN);
    localStorage.removeItem(Key.REFRESH_TOKEN);
  }

  isAuthenticated = (): boolean =>
    this.jwtHelper.decodeToken<string>(localStorage.getItem(Key.TOKEN)) &&
    !this.jwtHelper.isTokenExpired(localStorage.getItem(Key.TOKEN))
      ? true
      : false;

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${error.error.message}`;
    } else {
      if (error.error.reason) {
        errorMessage = error.error.reason;
        console.log(errorMessage);
      } else {
        errorMessage = `An error occurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }

  createGardeningPost$ = (id: number, formData: FormData) => {
    return this.http
      .post<CustomHttpResponse<Profile & GardeningPost>>(
        `${this.server}/user/give/addgardeningpost/image/${id}`,
        formData
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  newGardeningPost$ = () =>
    <Observable<CustomHttpResponse<Profile & GardeningPost>>>(
      this.http
        .get<CustomHttpResponse<Profile & GardeningPost>>(`${this.server}/user/gardeningpost/new`)
        .pipe(tap(console.log), catchError(this.handleError))
    );
}
