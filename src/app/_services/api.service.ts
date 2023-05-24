import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user.model';
import { Observable } from 'rxjs';

const API_URL = environment.BASE_URL + '/api/user';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  users!: User;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User> {
    return this.http.get<User>(API_URL + '/all-users');
  }

  getUserCount(): Observable<number> {
    return this.http.get<number>(API_URL + '/users-count');
  }
}
