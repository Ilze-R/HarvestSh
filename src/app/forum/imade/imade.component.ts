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
import { IMadeCommWithReplies } from 'src/app/_interface/iMadeCommWithReplies';
import { PostService } from 'src/app/_service/post.service';

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
  currentEditModeIndex: number | null = null;
  fromIMadeComponent: boolean = false;
  postLiked: boolean = false;
  editMode: boolean = false;
  editMode$ = new BehaviorSubject<boolean>(false);
  commentLiked: boolean = false;
  userLikedPosts: IMadePost[] = [];
  userLikedComments: IMadeComment[] = [];
  commentsWithReplies: IMadeCommWithReplies[] = [];
  isReply: boolean = false;
  isReplyReply: boolean = false;
  selectedCommentIndex: number | null = null;
  selectedCommentCommentIndex: number | null = null;
  selectedRepliesViewIndex: number | null = null;
  viewReplies: boolean = false;
  selectedMainCommentId: number | null = null;

  constructor(
    private router: Router,
    public sharedService: SharedService,
    public postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.userState$ = this.userService.profile$().pipe(
      map((response) => {
        this.userLikedPosts = response.data.likedIMadePosts;
        this.userLikedComments = response.data.likedIMadeComments;
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
    this.viewReplies = false;
  }

  private loadData(page: number = 1, pageSize: number = 10): void {
    this.imadePostState$ = this.postService
      .allPosts$<IMadePost>('imade', this.currentPage, this.pageSize)
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

  processCommentsAndReplies(data: IMadeComment[]): IMadeCommWithReplies[] {
    const commentsWithReplies: IMadeCommWithReplies[] = [];
    const mainComments = data.filter(
      (comment) => comment.parent_comment_id === 0
    );

    mainComments.forEach((mainComment) => {
      const iMadeCommentWithReplies: IMadeCommWithReplies = {
        comment: mainComment,
        replies: data.filter(
          (reply) => reply.parent_comment_id === mainComment.id
        ),
      };
      commentsWithReplies.push(iMadeCommentWithReplies);
    });
    return commentsWithReplies;
  }

  deleteIMadePost(id: number): void {
    this.postService.deletePost$<IMadePost>('imade', id).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error deleting post', error);
      },
    });
  }

  addIMadePostComment(commentForm: NgForm): void {
    this.isLoadingSubject.next(true);
    const userId = this.dataSubject.value.data.user.id;
    const postId = this.responsivePostId;
    const trimmedCommentText = commentForm.value.comment_text.trim();
    commentForm.form.patchValue({ comment_text: trimmedCommentText });
    this.imadePostComment$ = this.postService
      .addPostComment$<IMadePost, IMadeComment>(
        'imade',
        userId,
        postId,
        commentForm.value
      )
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

  addIMadePostCommentReply(
    replyForm: NgForm,
    replyIid: number,
    mainId: number,
    main: boolean
  ): void {
    this.isLoadingSubject.next(true);
    const userId = this.dataSubject.value.data.user.id;
    const postId = this.responsivePostId;
    let mainComment;
    if (main) {
      const mainComment = this.commentsWithReplies.find(
        (comment) => comment.comment.id === mainId
      );
      replyForm.value.parent_comment_id = mainId;
      replyForm.value.reply_username = mainComment.comment.username;
      replyForm.value.comment_text = replyForm.value.comment_text.trim();
    } else {
      replyForm.value.parent_comment_id = mainId;
      this.commentsWithReplies.forEach((commentWithReplies) => {
        const foundReply = commentWithReplies.replies.find(
          (reply) => reply.id === replyIid
        );
        if (foundReply) {
          mainComment = commentWithReplies;
          replyForm.value.reply_username = foundReply.username;
          replyForm.value.comment_text = replyForm.value.comment_text.trim();
        }
      });
    }
    this.imadePostComment$ = this.postService
      .addPostComment$<IMadePost, IMadeComment>(
        'imade',
        userId,
        postId,
        replyForm.value
      )
      .pipe(
        map((response) => {
          this.isLoadingSubject.next(false);
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
    this.resetSelectedComment();
    this.resetSelectedCommenComment();
  }

  showReplyArea(commentIndex: number): void {
    this.selectedCommentIndex = commentIndex;
    this.isReply = true;
    this.resetSelectedCommenComment();
    this.editMode = false;
    this.editMode$.next(false);
    this.currentEditModeIndex = null;
  }

  showReplyReplyArea(commentIndex: number): void {
    this.selectedCommentCommentIndex = commentIndex;
    this.isReplyReply = true;
    this.resetSelectedComment();
    this.editMode = false;
    this.editMode$.next(false);
    this.currentEditModeIndex = null;
  }

  resetSelectedComment() {
    this.selectedCommentIndex = null;
  }
  resetSelectedCommenComment() {
    this.selectedCommentCommentIndex = null;
  }

  getDetails(i: number, postId: number) {
    this.responsivePostId = postId;
    this.imadePostState$.subscribe((response) => {
      console.log('POSTS response:', response);
    });
    this.clickedIndex = this.clickedIndex === i ? undefined : i;
    this.allCommentsState$ = this.postService
      .getPostComments$<IMadeComment>('imade', postId)
      .pipe(
        map((response) => {
          this.allCommentsSubject.next(response);
          const comments = response.comments;
          this.commentsWithReplies = this.processCommentsAndReplies(comments);
          return { dataState: DataState.LOADED, appData: response };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          console.error('Error fetching comments:', error);
          return of({ dataState: DataState.ERROR, error });
        })
      );
    this.viewReplies = false;
  }

  updatePostLike(id: number, userid: number) {
    this.postService.toggleLike$<IMadePost>('imade', id, userid).subscribe({
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
    this.postService.toggleCommentLike$<IMadeComment>('imade', id, userid).subscribe({
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

  isLikedComment(commentId: number): boolean {
    if (!this.userLikedComments || this.userLikedComments.length === 0) {
      return false;
    }
    return this.userLikedComments.some((comment) => comment.id === commentId);
  }

  newIMadePostForm(): void {
    this.router.navigate(['/newimadepost']);
  }

  goToReplies(mainCommentId: number) {
    this.viewReplies = true;
    if (this.selectedMainCommentId === mainCommentId) {
      this.selectedMainCommentId = null;
    } else {
      this.selectedMainCommentId = mainCommentId;
    }
    this.editMode = false;
    this.editMode$.next(false);
    this.currentEditModeIndex = null;
  }

  editComment(index: number): void {
    this.isReply = false;
    this.currentEditIndex = index;
    this.fromIMadeComponent = true;
    this.editMode = true;
    this.editMode$.next(false);
    this.currentEditModeIndex = index;
  }

  deleteComment(id: number): void {
    this.postService.deleteComment$<IMadeComment>('imade', id).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error editing comment', error);
      },
    });
  }

  cancelCommentEdit(): void {
    this.editMode = false;
    this.editMode$.next(false);
    this.currentEditModeIndex = null;
    this.currentEditIndex = null;
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
