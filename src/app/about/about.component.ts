import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../_service/shared.service';
import { State } from '../_interface/state';
import {
  Observable,
  BehaviorSubject,
  catchError,
  map,
  of,
  startWith,
} from 'rxjs';
import { DataState } from '../_enum/datastate.enum';
import { CustomHttpResponse, Profile } from '../_interface/appstates';
import { User } from '../_interface/user';
import { UserService } from '../_service/user.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  @Input() user: User;
  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  readonly DataState = DataState;

  constructor(
    public sharedService: SharedService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.profileState$ = this.userService.profile$().pipe(
      map((response) => {
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
