import { Component, OnInit } from '@angular/core';
import { State } from 'src/app/_interface/state';
import {
  Observable,
  BehaviorSubject,
  catchError,
  map,
  of,
  startWith,
} from 'rxjs';
import { CustomHttpResponse, Profile } from '../_interface/appstates';
import { DataState } from '../_enum/datastate.enum';
import { UserService } from '../_service/user.service';
import { SharedService } from '../_service/shared.service';

@Component({
  selector: 'app-dash-side-nav',
  templateUrl: './dash-side-nav.component.html',
  styleUrls: ['./dash-side-nav.component.scss'],
})
export class DashSideNavComponent implements OnInit {
  userState$: Observable<State<CustomHttpResponse<Profile>>>;
  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  activeTab: string = 'account';

  constructor(
    private userService: UserService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.userState$ = this.userService.profile$().pipe(
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

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
