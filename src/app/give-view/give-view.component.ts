import { Component, Input, OnInit } from '@angular/core';
import { User } from '../_interface/user';
import {
  Observable,
  BehaviorSubject,
  catchError,
  map,
  of,
  startWith,
} from 'rxjs';
import { CustomHttpResponse, Profile } from '../_interface/appstates';
import { State } from '../_interface/state';
import { DataState } from '../_enum/datastate.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../_service/user.service';
import { Give } from '../_interface/give';
import { GiveService } from '../_service/give.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-give-view',
  templateUrl: './give-view.component.html',
  styleUrls: ['./give-view.component.scss'],
})
export class GiveViewComponent implements OnInit {
  @Input() user: User;
  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  giveState$: Observable<State<CustomHttpResponse<Give>>>;
  private dataGiveSubject = new BehaviorSubject<CustomHttpResponse<Give>>(null);
  giveUpdateState$: Observable<State<CustomHttpResponse<Profile & Give>>>;
  private giveUpdateSubject = new BehaviorSubject<
    CustomHttpResponse<Profile & Give>
  >(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
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
    this.route.params.subscribe((params) => {
      const giveId = +params['id'];
      this.giveState$ = this.giveService.give$(giveId).pipe(
        map((response) => {
          this.dataGiveSubject.next(response);

          return { dataState: DataState.LOADED, appData: response };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error });
        })
      );
    });
  }

  updateGive(updateGiveForm: NgForm): void {
    this.isLoadingSubject.next(true);
    updateGiveForm.value.location = 'jelgava';
    this.route.params.subscribe((params) => {
      const giveId = +params['id'];
      updateGiveForm.value.id = giveId;
      this.giveState$ = this.giveService
        .update$(this.dataSubject.value.data.user.id, updateGiveForm.value)
        .pipe(
          map((response) => {
            console.log(response);
            this.dataGiveSubject.next({ ...response, data: response.data });
            this.isLoadingSubject.next(false);
            return {
              dataState: DataState.LOADED,
              appData: this.dataGiveSubject.value,
            };
          }),
          startWith({
            dataState: DataState.LOADED,
            appData: this.dataGiveSubject.value,
          }),
          catchError((error: string) => {
            this.isLoadingSubject.next(false);
            return of({
              dataState: DataState.LOADED,
              appData: this.dataGiveSubject.value,
              error,
            });
          })
        );
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }
}
