import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { CustomHttpResponse, Profile } from '../_interface/appstates';
import { Give } from '../_interface/give';

@Injectable({
  providedIn: 'root',
})
export class GiveService {
  private readonly server: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  newGive$ = () =>
    <Observable<CustomHttpResponse<Profile & Give>>>(
      this.http
        .get<CustomHttpResponse<Profile & Give>>(`${this.server}/user/give/new`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  createGive$ = (id: number, formData: FormData) => {
    return this.http
      .post<CustomHttpResponse<Profile & Give>>(
        `${this.server}/user/give/addtouser/image/${id}`,
        formData
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  give$ = (id: number): Observable<CustomHttpResponse<Profile & Give>> =>
    this.http
      .get<CustomHttpResponse<Profile & Give>>(`${this.server}/user/give/${id}`)
      .pipe(catchError(this.handleError));

  gives$ = (): Observable<
    CustomHttpResponse<{ user: Profile; give: Give[] }>
  > =>
    this.http
      .get<CustomHttpResponse<{ user: Profile; give: Give[] }>>(
        `${this.server}/user/give/list`
      )
      .pipe(catchError(this.handleError));

  update$ = (id: number, give: Give) =>
    <Observable<CustomHttpResponse<Give>>>(
      this.http
        .patch<CustomHttpResponse<Give>>(
          `${this.server}/user/give/update/${id}`,
          give
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

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
}
