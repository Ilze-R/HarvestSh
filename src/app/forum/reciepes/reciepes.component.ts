import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Observable,
  BehaviorSubject,
  map,
  startWith,
  catchError,
  of,
} from 'rxjs';
import { DataState } from 'src/app/_enum/datastate.enum';
import { EventType } from 'src/app/_enum/event-type.enum';
import { CustomHttpResponse, Profile } from 'src/app/_interface/appstates';
import { RecipeComment } from 'src/app/_interface/recipecomment';
import { RecipePost } from 'src/app/_interface/recipepost';
import { State } from 'src/app/_interface/state';
import { User } from 'src/app/_interface/user';
import { SharedService } from 'src/app/_service/shared.service';
import { UserService } from 'src/app/_service/user.service';
import { Tooltip } from 'node_modules/bootstrap/dist/js/bootstrap.esm.min.js';

@Component({
  selector: 'app-reciepes',
  templateUrl: './reciepes.component.html',
  styleUrls: ['./reciepes.component.scss'],
})
export class ReciepesComponent implements OnInit {
  // @Input() user: User;
  userForCommentsState$: Observable<State<CustomHttpResponse<Profile & User>>>;
  // private userForCommentsSubject = new BehaviorSubject<
  //   CustomHttpResponse<Profile & User>
  // >(null);
  recipePostState$: Observable<State<CustomHttpResponse<Profile & RecipePost>>>;
  private recipePostSubject = new BehaviorSubject<
    CustomHttpResponse<Profile & RecipePost>
  >(null);
  allCommentsState$: Observable<State<CustomHttpResponse<RecipeComment>>>;
  private allCommentsSubject = new BehaviorSubject<
    CustomHttpResponse<RecipeComment>
  >(null);
  recipePostComment$: Observable<
    State<CustomHttpResponse<Profile & RecipePost>>
  >;
  private recipePostCommentSubject = new BehaviorSubject<
    CustomHttpResponse<Profile & RecipePost>
  >(null);
  userState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  readonly EventType = EventType;
  currentPage = 1;
  pageSize = 10;
  count: any;
  clickedIndex: any;
  responsivePostId: number;
  toggleActive: boolean = true;
  currentEditIndex: number | null = null;
  fromRecipesComponent: boolean = false;
  activeLink: string = this.sharedService.currentFormType;
  postLiked: boolean = false;
  commentLiked: boolean = false;
  userLikedPosts: RecipePost[] = [];

  constructor(
    private router: Router,
    public sharedService: SharedService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.sharedService.editEvent$.subscribe(() => {
      this.loadData();
    });
    this.loadData();
    this.userState$ = this.userService.profile$().pipe(
      map((response) => {
        this.userLikedPosts = response.data.likedRecipePosts;
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED, appData: response };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, error });
      })
    );
    Array.from(
      document.querySelectorAll('button[data-bs-toggle="tooltip"]')
    ).forEach((tooltipNode) => new Tooltip(tooltipNode));
    this.activeLink = 'Reciepes';
    this.sharedService.currentFormType = 'recipe';
  }

  private loadData(page: number = 1, pageSize: number = 10): void {
    this.recipePostState$ = this.userService
      .allRecipePosts$(this.currentPage, this.pageSize)
      .pipe(
        map((response) => {
          this.recipePostSubject.next(response);
          const posts = (response.data as any)?.posts || [];
          this.count = posts.length;
          return { dataState: DataState.LOADED, appData: response };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error });
        })
      );
  }

  deleteRecipePost(id: number): void {
    this.userService.deleteRecipePost$(id).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error deleting post', error);
      },
    });
  }

  addRecipePostComment(commentForm: NgForm): void {
    this.isLoadingSubject.next(true);
    const userId = this.dataSubject.value.data.user.id;
    const postId = this.responsivePostId;
    this.recipePostComment$ = this.userService
      .addRecipePostComment$(userId, postId, commentForm.value)
      .pipe(
        map((response) => {
          this.isLoadingSubject.next(false);
          commentForm.form.patchValue({ parent_comment_id: -1 });
          this.recipePostCommentSubject.next(response);
          return {
            dataState: DataState.LOADED,
            appData: this.recipePostCommentSubject.value,
          };
        }),
        startWith({
          dataState: DataState.LOADING,
          appData: this.recipePostCommentSubject.value,
        }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          console.error(error);
          return of({ dataState: DataState.ERROR, error });
        })
      );
    this.recipePostComment$.subscribe((response) => {
      this.loadData();
    });
  }

  getDetails(i: number, postId: number) {
    this.responsivePostId = postId;
    this.recipePostState$.subscribe((response) => {
      console.log('POSTS response:', response);
    });
    this.clickedIndex = this.clickedIndex === i ? undefined : i;
    this.allCommentsState$ = this.userService
      .getRecipePostComments$(postId)
      .pipe(
        map((response) => {
          this.allCommentsSubject.next(response);
          return { dataState: DataState.LOADED, appData: response };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          console.error('Error fetching comments:', error);
          return of({ dataState: DataState.ERROR, error });
        })
      );
  }

  updatePostLike(id: number, userid: number) {
    this.userService.toggleRecipeLike$(id, userid).subscribe({
      next: (response) => {
        console.log(response);
        this.postLiked = !this.postLiked;
        this.loadData();
      },
      error: (error) => {
        console.error('Error toggling like', error);
      },
    });
  }

  updateCommentLike(id: number, userid: number) {
    this.userService.toggleRecipeCommentLike$(id, userid).subscribe({
      next: (response) => {
        console.log(response);
        this.commentLiked = !this.commentLiked;
        this.loadData();
      },
      error: (error) => {
        console.error('Error toggling comment like', error);
      },
    });
  }

  isLikedPost(postId: number): boolean {
    if (!this.userLikedPosts) {
      return false;
    }
    return this.userLikedPosts.some((post) => post.id === postId);
  }

  newRecipePostForm(): void {
    this.router.navigate(['/newrecipepost']);
  }

  editComment(index: number): void {
    this.currentEditIndex = index;
    this.fromRecipesComponent = true;
  }

  deleteComment(id: number): void {
    this.userService.deleteRecipeComment$(id).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error editing comment', error);
      },
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadData();
  }

  disableTooltip() {
    this.toggleActive = false;
  }

  formatTimeDifference(postDate: any): string {
    if (typeof postDate === 'string') {
      postDate = new Date(Date.parse(postDate));
    }
    const now = new Date();
    const diffInMilliseconds = now.getTime() - postDate.getTime();
    const minutes = Math.floor(diffInMilliseconds / (60 * 1000));
    const hours = Math.floor(minutes / 60);
    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes} min ago`;
    } else if (hours < 24) {
      // return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      return `today`;
    } else {
      return postDate.toLocaleDateString();
    }
  }
}
