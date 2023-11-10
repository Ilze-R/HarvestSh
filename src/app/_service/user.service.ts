import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  Observable,
  tap,
  catchError,
  throwError,
  BehaviorSubject,
  map,
} from 'rxjs';
import { Key } from '../_enum/key.enum';
import {
  CustomHttpResponse,
  Profile,
  AccountType,
} from '../_interface/appstates';
import { User } from '../_interface/user';
import { Give } from '../_interface/give';
import { GardeningPost } from '../_interface/gardeningost';
import { RecipePost } from '../_interface/recipepost';
import { IMadePost } from '../_interface/imadepost';
import { OtherPost } from '../_interface/otherpost';
import { GardeningComment } from '../_interface/gardeningcomment';
import { RecipeComment } from '../_interface/recipecomment';
import { IMadeComment } from '../_interface/imadecomment';
import { OtherComment } from '../_interface/othercomment';
import { Number } from 'mongoose';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly server: string = 'http://localhost:8080';
  private jwtHelper = new JwtHelperService();
  private userProfileSubject = new BehaviorSubject<Profile | null>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  constructor(private http: HttpClient) {}

  setUserProfile(profile: Profile): void {
    this.userProfileSubject.next(profile);
  }

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

  getUserById$ = (userId: number) =>
    <Observable<CustomHttpResponse<User & Profile>>>(
      this.http
        .get<CustomHttpResponse<User>>(`${this.server}/user/${userId}`)
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
        `${this.server}/user/addgardeningpost/image/${id}`,
        formData
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  createGardeningPostNoPhoto$ = (id: number, gardeningPost: GardeningPost) => {
    return this.http
      .post<CustomHttpResponse<Profile & GardeningPost>>(
        `${this.server}/user/addgardeningpost/${id}`,
        gardeningPost
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  createRecipePost$ = (id: number, formData: FormData) => {
    return this.http
      .post<CustomHttpResponse<Profile & RecipePost>>(
        `${this.server}/user/addrecipepost/image/${id}`,
        formData
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  createIMadePost$ = (id: number, formData: FormData) => {
    return this.http
      .post<CustomHttpResponse<Profile & IMadePost>>(
        `${this.server}/user/addimadepost/image/${id}`,
        formData
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  createOtherPost$ = (id: number, formData: FormData) => {
    return this.http
      .post<CustomHttpResponse<Profile & OtherPost>>(
        `${this.server}/user/addotherpost/image/${id}`,
        formData
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  newGardeningPost$ = () =>
    <Observable<CustomHttpResponse<Profile & GardeningPost>>>(
      this.http
        .get<CustomHttpResponse<Profile & GardeningPost>>(
          `${this.server}/user/post/new`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  newRecipePost$ = () =>
    <Observable<CustomHttpResponse<Profile & RecipePost>>>(
      this.http
        .get<CustomHttpResponse<Profile & RecipePost>>(
          `${this.server}/user/post/new`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  newIMadePost$ = () =>
    <Observable<CustomHttpResponse<Profile & IMadePost>>>(
      this.http
        .get<CustomHttpResponse<Profile & IMadePost>>(
          `${this.server}/user/post/new`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  newOtherPost$ = () =>
    <Observable<CustomHttpResponse<Profile & OtherPost>>>(
      this.http
        .get<CustomHttpResponse<Profile & OtherPost>>(
          `${this.server}/user/post/new`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  allGardeningPosts$ = (page: number, pageSize: number) =>
    <Observable<CustomHttpResponse<Profile & GardeningPost>>>(
      this.http
        .get<CustomHttpResponse<Profile & GardeningPost>>(
          `${this.server}/user/gardening/list?page=${page}&pageSize=${pageSize}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  allRecipePosts$ = (page: number, pageSize: number) =>
    <Observable<CustomHttpResponse<Profile & RecipePost>>>(
      this.http
        .get<CustomHttpResponse<Profile & RecipePost>>(
          `${this.server}/user/recipe/list?page=${page}&pageSize=${pageSize}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  recipePostCount$ = () =>
    <Observable<CustomHttpResponse<number>>>(
      this.http
        .get<CustomHttpResponse<number>>(`${this.server}/user/recipe/count`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  allIMadePosts$ = (page: number, pageSize: number) =>
    <Observable<CustomHttpResponse<Profile & IMadePost>>>(
      this.http
        .get<CustomHttpResponse<Profile & IMadePost>>(
          `${this.server}/user/imade/list?page=${page}&pageSize=${pageSize}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  allOtherPosts$ = (page: number, pageSize: number) =>
    <Observable<CustomHttpResponse<Profile & OtherPost>>>(
      this.http
        .get<CustomHttpResponse<Profile & OtherPost>>(
          `${this.server}/user/other/list?page=${page}&pageSize=${pageSize}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  addGardeningPostComment$ = (
    userId: number,
    postId: number,
    comment: GardeningComment
  ) => {
    return this.http
      .post<CustomHttpResponse<Profile & GardeningPost>>(
        `${this.server}/user/addgardeningcomment/${userId}/${postId}`,
        comment
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  getGardeningPostComments$ = (id: number) => {
    return (
      this.http
        .get<CustomHttpResponse<GardeningComment[]>>(
          `${this.server}/user/gardeningpost/comments/${id}`
        )
        // .pipe(tap(console.log), catchError(this.handleError));
        .pipe(
          map((response) => response.data),
          tap(console.log),
          catchError(this.handleError)
        )
    );
    // );
  };

  addRecipePostComment$ = (
    userId: number,
    postId: number,
    comment: RecipeComment
  ) => {
    return this.http
      .post<CustomHttpResponse<Profile & RecipePost>>(
        `${this.server}/user/addrecipecomment/${userId}/${postId}`,
        comment
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  getRecipePostComments$ = (id: number) => {
    return this.http
      .get<CustomHttpResponse<RecipeComment[]>>(
        `${this.server}/user/recipepost/comments/${id}`
      )
      .pipe(
        map((response) => response.data),
        tap(console.log),
        catchError(this.handleError)
      );
  };

  addIMadePostComment$ = (
    userId: number,
    postId: number,
    comment: IMadeComment
  ) => {
    return this.http
      .post<CustomHttpResponse<Profile & IMadePost>>(
        `${this.server}/user/addimadecomment/${userId}/${postId}`,
        comment
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  getIMadePostComments$ = (id: number) => {
    return this.http
      .get<CustomHttpResponse<IMadeComment[]>>(
        `${this.server}/user/imadepost/comments/${id}`
      )
      .pipe(
        map((response) => response.data),
        tap(console.log),
        catchError(this.handleError)
      );
  };

  addOtherPostComment$ = (
    userId: number,
    postId: number,
    comment: OtherComment
  ) => {
    return this.http
      .post<CustomHttpResponse<Profile & OtherPost>>(
        `${this.server}/user/addothercomment/${userId}/${postId}`,
        comment
      )
      .pipe(tap(console.log), catchError(this.handleError));
  };

  getOtherPostComments$ = (id: number) => {
    return this.http
      .get<CustomHttpResponse<OtherComment[]>>(
        `${this.server}/user/otherpost/comments/${id}`
      )
      .pipe(
        map((response) => response.data),
        tap(console.log),
        catchError(this.handleError)
      );
  };

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

  deleteGardeningComment$ = (id: number) =>
    <Observable<CustomHttpResponse<GardeningComment>>>(
      this.http
        .delete<CustomHttpResponse<GardeningComment>>(
          `${this.server}/post/delete/gardeningcomment/${id}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  deleteRecipeComment$ = (id: number) =>
    <Observable<CustomHttpResponse<RecipeComment>>>(
      this.http
        .delete<CustomHttpResponse<RecipeComment>>(
          `${this.server}/post/delete/recipecomment/${id}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  deleteIMadeComment$ = (id: number) =>
    <Observable<CustomHttpResponse<IMadeComment>>>(
      this.http
        .delete<CustomHttpResponse<IMadeComment>>(
          `${this.server}/post/delete/imadecomment/${id}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  deleteOtherComment$ = (id: number) =>
    <Observable<CustomHttpResponse<OtherComment>>>(
      this.http
        .delete<CustomHttpResponse<OtherComment>>(
          `${this.server}/post/delete/othercomment/${id}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  toggleGardeningLike$ = (id: number, userid: number) =>
    <Observable<CustomHttpResponse<GardeningPost>>>(
      this.http
        .patch<CustomHttpResponse<GardeningPost>>(
          `${this.server}/post/toggle/gardeninglikes/${id}/${userid}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  toggleRecipeLike$ = (id: number, userid: number) =>
    <Observable<CustomHttpResponse<RecipePost>>>(
      this.http
        .patch<CustomHttpResponse<RecipePost>>(
          `${this.server}/post/toggle/recipelikes/${id}/${userid}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  toggleIMadeLike$ = (id: number, userid: number) =>
    <Observable<CustomHttpResponse<IMadePost>>>(
      this.http
        .patch<CustomHttpResponse<IMadePost>>(
          `${this.server}/post/toggle/imadelikes/${id}/${userid}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  toggleOtherLike$ = (id: number, userid: number) =>
    <Observable<CustomHttpResponse<OtherPost>>>(
      this.http
        .patch<CustomHttpResponse<OtherPost>>(
          `${this.server}/post/toggle/otherlikes/${id}/${userid}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  getUserLikedGardeningPosts$ = (id: number) =>
    <Observable<CustomHttpResponse<GardeningPost>>>(
      this.http
        .get<CustomHttpResponse<GardeningPost>>(
          `${this.server}/post/gardeningpostlikes/${id}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  getUserLikedRecipePosts$ = (id: number) =>
    <Observable<CustomHttpResponse<RecipePost>>>(
      this.http
        .get<CustomHttpResponse<RecipePost>>(
          `${this.server}/post/recipepostlikes/${id}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  getUserLikedIMadePosts$ = (id: number) =>
    <Observable<CustomHttpResponse<IMadePost>>>(
      this.http
        .get<CustomHttpResponse<IMadePost>>(
          `${this.server}/post/imadepostlikes/${id}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );
  getUserLikedOtherPosts$ = (id: number) =>
    <Observable<CustomHttpResponse<OtherPost>>>(
      this.http
        .get<CustomHttpResponse<OtherPost>>(
          `${this.server}/post/otherpostlikes/${id}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  toggleGardeningCommentLike$ = (userId: number, id: number) =>
    <Observable<CustomHttpResponse<GardeningComment>>>(
      this.http
        .patch<CustomHttpResponse<GardeningComment>>(
          `${this.server}/post/toggle/gardeningcommentlike/${userId}/${id}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  toggleRecipeCommentLike$ = (userId: number, id: number) =>
    <Observable<CustomHttpResponse<RecipeComment>>>(
      this.http
        .patch<CustomHttpResponse<RecipeComment>>(
          `${this.server}/post/toggle/recipecommentlike/${userId}/${id}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  toggleIMadeCommentLike$ = (userId: number, id: number) =>
    <Observable<CustomHttpResponse<IMadeComment>>>(
      this.http
        .patch<CustomHttpResponse<IMadeComment>>(
          `${this.server}/post/toggle/imadecommentlike/${userId}/${id}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  toggleOtherCommentLike$ = (userId: number, id: number) =>
    <Observable<CustomHttpResponse<OtherComment>>>(
      this.http
        .patch<CustomHttpResponse<OtherComment>>(
          `${this.server}/post/toggle/othercommentlike/${userId}/${id}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  getUserLikedGardeningComments$ = (id: number) =>
    <Observable<CustomHttpResponse<GardeningComment>>>(
      this.http
        .get<CustomHttpResponse<GardeningComment>>(
          `${this.server}/post/gardeningcommentlikes/${id}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  getUserLikedRecipeComments$ = (id: number) =>
    <Observable<CustomHttpResponse<RecipeComment>>>(
      this.http
        .get<CustomHttpResponse<RecipeComment>>(
          `${this.server}/post/recipecommentlikes/${id}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  getUserLikedIMadeComments$ = (id: number) =>
    <Observable<CustomHttpResponse<IMadeComment>>>(
      this.http
        .get<CustomHttpResponse<IMadeComment>>(
          `${this.server}/post/imadecommentlikes/${id}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  getUserLikedOtherComments$ = (id: number) =>
    <Observable<CustomHttpResponse<OtherComment>>>(
      this.http
        .get<CustomHttpResponse<OtherComment>>(
          `${this.server}/post/othercommentlikes/${id}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  deleteGardeningPost$ = (id: number) =>
    <Observable<CustomHttpResponse<GardeningPost>>>(
      this.http
        .delete<CustomHttpResponse<GardeningPost>>(
          `${this.server}/post/delete/gardeningpost/${id}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  deleteRecipePost$ = (id: number) =>
    <Observable<CustomHttpResponse<RecipePost>>>(
      this.http
        .delete<CustomHttpResponse<RecipePost>>(
          `${this.server}/post/delete/recipepost/${id}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  deleteIMadePost$ = (id: number) =>
    <Observable<CustomHttpResponse<IMadePost>>>(
      this.http
        .delete<CustomHttpResponse<IMadePost>>(
          `${this.server}/post/delete/imadepost/${id}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  deleteOtherPost$ = (id: number) =>
    <Observable<CustomHttpResponse<OtherPost>>>(
      this.http
        .delete<CustomHttpResponse<OtherPost>>(
          `${this.server}/post/delete/otherpost/${id}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  // recipePostCount$ = () =>
  // <Observable<CustomHttpResponse<number>>>(
  //   this.http
  //     .get<CustomHttpResponse<number>>(`${this.server}/user/recipe/count`)
  //     .pipe(tap(console.log), catchError(this.handleError))
  // );
}
