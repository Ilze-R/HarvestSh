import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const API_URL = environment.BASE_URL + '/api/authentication';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User | null>;
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

  public get currentUserValue(): User {
    return this.currentUserSubject.value!;
  }

  setSessionUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    console.log('shbdhsbsAAAAA');
    this.router.navigate(['/']);
    console.log('loggin out');
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
      map((res) => {
        if (res) {
          this.setSessionUser(res);
        } else {
          return false;
        }
        return res;
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
