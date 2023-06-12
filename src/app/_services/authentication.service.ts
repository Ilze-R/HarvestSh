import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

const API_URL = environment.BASE_URL + '/api/authentication';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private isLoggedIn = new BehaviorSubject<boolean>(this.userIsLoggedIn());
  public loggedUser = this.isLoggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    let storageUser: User | null = null;
    const storageUserAsStr = localStorage.getItem('currentUser');
    if (storageUserAsStr) {
      storageUser = JSON.parse(storageUserAsStr);
    }
    this.currentUserSubject = new BehaviorSubject<User | null>(storageUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value!;
  }

  setSessionUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  login(user: User): Observable<any> {
    return this.http.post<User>(API_URL + '/sign-in', user).pipe(
      map((res) => {
        if (res) {
          // set session-user
          this.setSessionUser(res);
        } else {
          return false;
        }
        return res;
      })
    );
  }

  register(user: User): Observable<any> {
    return this.http.post<User>(API_URL + '/sign-up', user).pipe(
      switchMap((res) => {
        if (res) {
          this.setSessionUser(res);
          return of(res);
        } else {
          return throwError('Registration failed');
        }
      }),
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 400) {
          if (error.error && error.error.message) {
            return throwError(error.error.message);
          }
        }
        return throwError('Registration failed');
      })
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post(
      API_URL + '/refresh-token?token=' + this.currentUserValue?.refreshToken,
      {}
    );
  }

  userIsLoggedIn() {
    return !!localStorage.getItem('currentUser');
  }

  // get isUserLoggedIn() {
  //   return this.loggedIn.asObservable();
  // }
}
