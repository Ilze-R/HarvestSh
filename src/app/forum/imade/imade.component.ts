import { Component, OnInit } from '@angular/core';
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
import { IMadePost } from 'src/app/_interface/imadepost';
import { OtherPost } from 'src/app/_interface/otherpost';
import { State } from 'src/app/_interface/state';
import { SharedService } from 'src/app/_service/shared.service';
import { UserService } from 'src/app/_service/user.service';

@Component({
  selector: 'app-imade',
  templateUrl: './imade.component.html',
  styleUrls: ['./imade.component.scss'],
})
export class ImadeComponent implements OnInit {
  imadePostState$: Observable<State<CustomHttpResponse<Profile & IMadePost>>>;
  private imadePostSubject = new BehaviorSubject<
    CustomHttpResponse<Profile & IMadePost>
  >(null);
  readonly DataState = DataState;
  readonly EventType = EventType;
  currentPage = 1;
  pageSize = 10;
  count: any;

  constructor(
    private router: Router,
    public sharedService: SharedService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(page: number = 1, pageSize: number = 10): void {
    this.imadePostState$ = this.userService.allIMadePosts$().pipe(
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

  newIMadePostForm(): void {
    this.router.navigate(['/newimadepost']);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadData();
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
