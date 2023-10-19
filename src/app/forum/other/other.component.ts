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
import { OtherComment } from 'src/app/_interface/othercomment';
import { OtherPost } from 'src/app/_interface/otherpost';
import { State } from 'src/app/_interface/state';
import { User } from 'src/app/_interface/user';
import { SharedService } from 'src/app/_service/shared.service';
import { UserService } from 'src/app/_service/user.service';
import { Tooltip } from 'node_modules/bootstrap/dist/js/bootstrap.esm.min.js';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss'],
})
export class OtherComponent implements OnInit {
  // @Input() user: User;
  userForCommentsState$: Observable<State<CustomHttpResponse<Profile & User>>>;
  // private userForCommentsSubject = new BehaviorSubject<
  //   CustomHttpResponse<Profile & User>
  // >(null);
  otherPostState$: Observable<State<CustomHttpResponse<Profile & OtherPost>>>;
  private otherPostSubject = new BehaviorSubject<
    CustomHttpResponse<Profile & OtherPost>
  >(null);
  allCommentsState$: Observable<State<CustomHttpResponse<OtherComment>>>;
  private allCommentsSubject = new BehaviorSubject<
    CustomHttpResponse<OtherComment>
  >(null);
  otherPostComment$: Observable<State<CustomHttpResponse<Profile & OtherPost>>>;
  private otherPostCommentSubject = new BehaviorSubject<
    CustomHttpResponse<Profile & OtherPost>
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
  fromOtherComponent: boolean = false;
  activeLink: string = this.sharedService.currentFormType;
  postLiked: boolean = false;
  userLikedPosts: OtherPost[] = [];

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
        this.userLikedPosts = response.data.likedOtherPosts;
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
    this.activeLink = 'Other';
    this.sharedService.currentFormType = 'other';
  }

  private loadData(page: number = 1, pageSize: number = 10): void {
    this.otherPostState$ = this.userService
      .allOtherPosts$(this.currentPage, this.pageSize)
      .pipe(
        map((response) => {
          this.otherPostSubject.next(response);
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

  deleteOtherPost(id: number): void {
    this.userService.deleteOtherPost$(id).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error deleting post', error);
      },
    });
  }

  addOtherPostComment(commentForm: NgForm): void {
    this.isLoadingSubject.next(true);
    const userId = this.dataSubject.value.data.user.id;
    const postId = this.responsivePostId;
    this.otherPostComment$ = this.userService
      .addOtherPostComment$(userId, postId, commentForm.value)
      .pipe(
        map((response) => {
          this.isLoadingSubject.next(false);
          commentForm.form.patchValue({ parent_comment_id: -1 });
          this.otherPostCommentSubject.next(response);
          return {
            dataState: DataState.LOADED,
            appData: this.otherPostCommentSubject.value,
          };
        }),
        startWith({
          dataState: DataState.LOADING,
          appData: this.otherPostCommentSubject.value,
        }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          console.error(error);
          return of({ dataState: DataState.ERROR, error });
        })
      );
    this.otherPostComment$.subscribe((response) => {
      this.loadData();
    });
  }

  getDetails(i: number, postId: number) {
    this.responsivePostId = postId;
    this.otherPostState$.subscribe((response) => {
      console.log('POSTS response:', response);
    });
    this.clickedIndex = this.clickedIndex === i ? undefined : i;
    this.allCommentsState$ = this.userService
      .getOtherPostComments$(postId)
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
    this.userService.toggleOtherLike$(id, userid).subscribe({
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

  newOtherPostForm(): void {
    this.router.navigate(['/newotherpost']);
  }

  editComment(index: number): void {
    this.currentEditIndex = index;
    this.fromOtherComponent = true;
  }

  deleteComment(id: number): void {
    this.userService.deleteOtherComment$(id).subscribe({
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
