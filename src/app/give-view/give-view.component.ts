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

@Component({
  selector: 'app-give-view',
  templateUrl: './give-view.component.html',
  styleUrls: ['./give-view.component.scss'],
})
export class GiveViewComponent implements OnInit {
  @Input() user: User;
  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  giveState$: Observable<State<CustomHttpResponse<Profile & Give>>>;
  private dataGiveSubject = new BehaviorSubject<
    CustomHttpResponse<Profile & Give>
  >(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
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
      this.giveState$ = this.userService.give$(giveId).pipe(
        map((response) => {
          this.dataGiveSubject.next(response);
          console.log(response + 'SHDSHIDUHDUUJDS');
          return { dataState: DataState.LOADED, appData: response };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error });
        })
      );
    });
  }
}
