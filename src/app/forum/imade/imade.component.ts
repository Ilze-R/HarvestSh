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
import { IMadeComment } from 'src/app/_interface/imadecomment';
import { IMadePost } from 'src/app/_interface/imadepost';
import { State } from 'src/app/_interface/state';
import { User } from 'src/app/_interface/user';
import { SharedService } from 'src/app/_service/shared.service';
import { UserService } from 'src/app/_service/user.service';
import { Tooltip } from 'node_modules/bootstrap/dist/js/bootstrap.esm.min.js';

@Component({
  selector: 'app-imade',
  templateUrl: './imade.component.html',
  styleUrls: ['./imade.component.scss'],
})
export class ImadeComponent implements OnInit {
  userForCommentsState$: Observable<State<CustomHttpResponse<Profile & User>>>;
  imadePostState$: Observable<State<CustomHttpResponse<Profile & IMadePost>>>;
  private imadePostSubject = new BehaviorSubject<
    CustomHttpResponse<Profile & IMadePost>
  >(null);
  allCommentsState$: Observable<State<CustomHttpResponse<IMadeComment>>>;
  private allCommentsSubject = new BehaviorSubject<
    CustomHttpResponse<IMadeComment>
  >(null);
  imadePostComment$: Observable<State<CustomHttpResponse<Profile & IMadePost>>>;
  private imadePostCommentSubject = new BehaviorSubject<
    CustomHttpResponse<Profile & IMadePost>
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
  fromIMadeComponent: boolean = false;
  activeLink: string = this.sharedService.currentFormType;
  postLiked: boolean = false;
  userLikedPosts: IMadePost[] = [];

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
        this.userLikedPosts = response.data.likedIMadePosts;
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
    this.activeLink = 'Imade';
    this.sharedService.currentFormType = 'imade';
  }

  private loadData(page: number = 1, pageSize: number = 10): void {
    this.imadePostState$ = this.userService
      .allIMadePosts$(this.currentPage, this.pageSize)
      .pipe(
        map((response) => {
          this.imadePostSubject.next(response);
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

  addIMadePostComment(commentForm: NgForm): void {
    this.isLoadingSubject.next(true);
    const userId = this.dataSubject.value.data.user.id;
    const postId = this.responsivePostId;
    this.imadePostComment$ = this.userService
      .addIMadePostComment$(userId, postId, commentForm.value)
      .pipe(
        map((response) => {
          this.isLoadingSubject.next(false);
          commentForm.form.patchValue({ parent_comment_id: -1 });
          this.imadePostCommentSubject.next(response);
          return {
            dataState: DataState.LOADED,
            appData: this.imadePostCommentSubject.value,
          };
        }),
        startWith({
          dataState: DataState.LOADING,
          appData: this.imadePostCommentSubject.value,
        }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          console.error(error);
          return of({ dataState: DataState.ERROR, error });
        })
      );
    this.imadePostComment$.subscribe((response) => {
      this.loadData();
    });
  }

  getDetails(i: number, postId: number) {
    this.responsivePostId = postId;
    this.imadePostState$.subscribe((response) => {
      console.log('POSTS response:', response);
    });
    this.clickedIndex = this.clickedIndex === i ? undefined : i;
    this.allCommentsState$ = this.userService
      .getIMadePostComments$(postId)
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
    // this.userService.getUserById$(postId).subscribe((userResponse) => {
    //   this.userForCommentsState$;
    //   console.log(userResponse + 'USERID');
    // });
  }

  updateLike(id: number, userid: number) {
    this.userService.toggleIMadeLike$(id, userid).subscribe({
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

  isLikedPost(postId: number): boolean {
    if (!this.userLikedPosts) {
      return false;
    }
    return this.userLikedPosts.some((post) => post.id === postId);
  }

  newIMadePostForm(): void {
    this.router.navigate(['/newimadepost']);
  }

  editComment(index: number): void {
    this.currentEditIndex = index;
    this.fromIMadeComponent = true;
  }

  deleteComment(id: number): void {
    this.userService.deleteIMadeComment$(id).subscribe({
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
