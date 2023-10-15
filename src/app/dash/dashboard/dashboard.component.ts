import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataState } from 'src/app/_enum/datastate.enum';
import { UserService } from 'src/app/_service/user.service';
import { State } from 'src/app/_interface/state';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  startWith,
} from 'rxjs';
import { CustomHttpResponse, Profile } from 'src/app/_interface/appstates';
import { User } from 'src/app/_interface/user';
import { EventType } from 'src/app/_enum/event-type.enum';
import { GiveService } from 'src/app/_service/give.service';
import { SharedService } from 'src/app/_service/shared.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Input() user: User;
  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>(false);
  showLogs$ = this.showLogsSubject.asObservable();
  readonly DataState = DataState;
  readonly EventType = EventType;

  center = { lat: 24, lng: 12 };
  // center: google.maps.LatLngLiteral = {
  //   lat: 24,
  //   lng: 12,
  // };
  zoom = 5;

  constructor(
    private router: Router,
    private userService: UserService,
    private giveService: GiveService,
    public sharedService: SharedService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.sharedService.showUGiveComonent = true;
  }

  private loadData(): void {
    this.profileState$ = this.userService.profile$().pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED, appData: response };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }
}
