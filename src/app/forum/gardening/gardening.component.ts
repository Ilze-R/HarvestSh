import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  BehaviorSubject,
  catchError,
  map,
  of,
  startWith,
} from 'rxjs';
import { DataState } from 'src/app/_enum/datastate.enum';
import { EventType } from 'src/app/_enum/event-type.enum';
import { CustomHttpResponse, Profile } from 'src/app/_interface/appstates';
import { GardeningPost } from 'src/app/_interface/gardeningost';
import { State } from 'src/app/_interface/state';
import { SharedService } from 'src/app/_service/shared.service';
import { UserService } from 'src/app/_service/user.service';

@Component({
  selector: 'app-gardening',
  templateUrl: './gardening.component.html',
  styleUrls: ['./gardening.component.scss'],
})
export class GardeningComponent implements OnInit {
  gardeningPostState$: Observable<
    State<CustomHttpResponse<Profile & GardeningPost>>
  >;
  private gardeningPostSubject = new BehaviorSubject<
    CustomHttpResponse<Profile & GardeningPost>
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
    this.gardeningPostState$ = this.userService.allGardeningPosts$().pipe(
      map((response) => {
        this.gardeningPostSubject.next(response);
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

  newGardeningPostForm(): void {
    this.router.navigate(['/newgardeningpost']);
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
