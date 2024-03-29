import { Component, OnInit } from '@angular/core';
import { State } from 'src/app/_interface/state';
import {
  Observable,
  BehaviorSubject,
  map,
  startWith,
  catchError,
  of,
} from 'rxjs';
import { DataState } from 'src/app/_enum/datastate.enum';
import { CustomHttpResponse, Profile } from 'src/app/_interface/appstates';
import { UserService } from 'src/app/_service/user.service';

@Component({
  selector: 'app-get',
  templateUrl: './get.component.html',
  styleUrls: ['./get.component.scss'],
})
export class GetComponent implements OnInit {
  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  readonly DataState = DataState;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadData();
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
