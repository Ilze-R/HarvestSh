import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError, Observable, throwError, map } from 'rxjs';
import { CustomHttpResponse, Profile } from '../_interface/appstates';
import { GardeningPost } from '../_interface/gardeningost';
import { GardeningComment } from '../_interface/gardeningcomment';
import { IMadeComment } from '../_interface/imadecomment';
import { OtherComment } from '../_interface/othercomment';
import { RecipeComment } from '../_interface/recipecomment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly server: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

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

  createGardeningPostNoPhoto$ = (id: number, gardeningPost: GardeningPost) => {
    return this.http
      .post<CustomHttpResponse<Profile & GardeningPost>>(
        `${this.server}/user/addgardeningpost/${id}`,
        gardeningPost
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  createPost$ = <T>(
    id: number,
    formData: FormData,
    endpoint: string
  ): Observable<CustomHttpResponse<Profile & T>> => {
    return this.http
      .post<CustomHttpResponse<Profile & T>>(
        `${this.server}/user/${endpoint}/${id}`,
        formData
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  newPost$ = <T>() =>
    this.http
      .get<CustomHttpResponse<Profile & T>>(`${this.server}/user/post/new`)
      .pipe(tap(console.log), catchError(this.handleError)) as Observable<
      CustomHttpResponse<Profile & T>
    >;

  allPosts$ = <T>(endpoint: string, page: number, pageSize: number) =>
    this.http
      .get<CustomHttpResponse<Profile & T>>(
        `${this.server}/user/${endpoint}/list?page=${page}&pageSize=${pageSize}`
      )
      .pipe(tap(console.log), catchError(this.handleError)) as Observable<
      CustomHttpResponse<Profile & T>
    >;

  toggleLike$ = <T>(endpoint: string, id: number, userid: number) =>
    this.http
      .patch<CustomHttpResponse<T>>(
        `${this.server}/post/toggle/${endpoint}likes/${id}/${userid}`,
        {}
      )
      .pipe(tap(console.log), catchError(this.handleError)) as Observable<
      CustomHttpResponse<T>
    >;

  deletePost$ = <T>(endpoint: string, id: number) =>
    this.http
      .delete<CustomHttpResponse<T>>(
        `${this.server}/post/delete/${endpoint}post/${id}`
      )
      .pipe(tap(console.log), catchError(this.handleError)) as Observable<
      CustomHttpResponse<T>
    >;

  addPostComment$ = <T, U>(
    endpoint: string,
    userId: number,
    postId: number,
    comment: U
  ) => {
    return this.http
      .post<CustomHttpResponse<Profile & T>>(
        `${this.server}/user/add${endpoint}comment/${userId}/${postId}`,
        comment
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  getPostComments$ = <T>(endpoint: string, id: number) => {
    return this.http
      .get<CustomHttpResponse<T[]>>(
        `${this.server}/user/${endpoint}post/comments/${id}`
      )
      .pipe(
        map((response) => response.data),
        tap(console.log),
        catchError(this.handleError)
      );
  };

  deleteComment$ = <T>(endpoint: string, id: number) =>
    this.http
      .delete<CustomHttpResponse<T>>(
        `${this.server}/post/delete/${endpoint}comment/${id}`
      )
      .pipe(tap(console.log), catchError(this.handleError)) as Observable<
      CustomHttpResponse<T>
    >;

  // editComment$ = <T>(
  //   endpoint: string,
  //   id: number,
  //   form: { comment_text: string }
  // ) =>
  //   this.http
  //     .patch<CustomHttpResponse<T>>(
  //       `${this.server}/user/update/${endpoint}comment/${id}`,
  //       form
  //     )
  //     .pipe(tap(console.log), catchError(this.handleError)) as Observable<
  //     CustomHttpResponse<T>
  //   >;

  editGardeningComent$ = (
    id: number,
    form: {
      comment_text: string;
    }
  ) =>
    <Observable<CustomHttpResponse<GardeningComment>>>(
      this.http
        .patch<CustomHttpResponse<GardeningComment>>(
          `${this.server}/user/update/gardeningcomment/${id}`,
          form
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  editIMadeComent$ = (
    id: number,
    form: {
      comment_text: string;
    }
  ) =>
    <Observable<CustomHttpResponse<IMadeComment>>>(
      this.http
        .patch<CustomHttpResponse<IMadeComment>>(
          `${this.server}/user/update/imadecomment/${id}`,
          form
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  editOtherComent$ = (
    id: number,
    form: {
      comment_text: string;
    }
  ) =>
    <Observable<CustomHttpResponse<OtherComment>>>(
      this.http
        .patch<CustomHttpResponse<OtherComment>>(
          `${this.server}/user/update/othercomment/${id}`,
          form
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  editRecipesComent$ = (
    id: number,
    form: {
      comment_text: string;
    }
  ) =>
    <Observable<CustomHttpResponse<RecipeComment>>>(
      this.http
        .patch<CustomHttpResponse<RecipeComment>>(
          `${this.server}/user/update/recipecomment/${id}`,
          form
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  toggleCommentLike$ = <T>(
    forumType: string,
    userId: number,
    id: number
  ): Observable<CustomHttpResponse<T>> =>
    this.http
      .patch<CustomHttpResponse<T>>(
        `${this.server}/post/toggle/${forumType}commentlike/${userId}/${id}`,
        {}
      )
      .pipe(tap(console.log), catchError(this.handleError));

  // getUserLikedPosts$ = <T>(endpoint: string, id: number) =>
  //   this.http
  //     .get<CustomHttpResponse<T>>(
  //       `${this.server}/post/${endpoint}postlikes/${id}`,
  //       {}
  //     )
  //     .pipe(tap(console.log), catchError(this.handleError)) as Observable<
  //     CustomHttpResponse<T>
  //   >;
}
