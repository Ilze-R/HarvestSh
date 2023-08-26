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
import { Give } from 'src/app/_interface/give';
import { EventType } from 'src/app/_enum/event-type.enum';
import { GiveService } from 'src/app/_service/give.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Input() user: User;
  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  givesState$: Observable<
    State<CustomHttpResponse<{ user: Profile; give: Give[] }>>
  >;
  private dataGiveSubject = new BehaviorSubject<
    CustomHttpResponse<{ user: Profile; give: Give[] }>
  >(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>(false);
  showLogs$ = this.showLogsSubject.asObservable();
  readonly DataState = DataState;
  readonly EventType = EventType;

  constructor(
    private router: Router,
    private userService: UserService,
    private giveService: GiveService
  ) {}

  ngOnInit(): void {
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
    this.givesState$ = this.giveService.gives$().pipe(
      map((response) => {
        const givesList: Give[] = response.data.give;
        // this.dataGiveSubject.next(response);
        const modifiedResponse = {
          ...response,
          data: { user: response.data.user, give: givesList },
        };
        this.dataGiveSubject.next(modifiedResponse);
        // console.log(JSON.stringify(this.dataGiveSubject) + 'GJKFDHDFHKDF');
        return { dataState: DataState.LOADED, appData: modifiedResponse };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }

  newGiveForm(): void {
    this.router.navigate(['/gives']);
  }

  updatePicture(image: File): void {
    if (image) {
      this.isLoadingSubject.next(true);
      this.profileState$ = this.userService
        .updateImage$(this.getFormData(image))
        .pipe(
          map((response) => {
            console.log(response);
            this.dataSubject.next({
              ...response,
              data: {
                ...response.data,
                user: {
                  ...response.data.user,
                  imageUrl: `${
                    response.data.user.imageUrl
                  }?time=${new Date().getTime()}`,
                },
              },
            });
            this.isLoadingSubject.next(false);
            return {
              dataState: DataState.LOADED,
              appData: this.dataSubject.value,
            };
          }),
          startWith({
            dataState: DataState.LOADED,
            appData: this.dataSubject.value,
          }),
          catchError((error: string) => {
            this.isLoadingSubject.next(false);
            return of({
              dataState: DataState.LOADED,
              appData: this.dataSubject.value,
              error,
            });
          })
        );
    }
  }
  private getFormData(image: File): FormData {
    const formData = new FormData();
    formData.append('image', image);
    return formData;
  }

  selectGive(id: number): void {
    this.router.navigate(['/give', id]);
  }
}
