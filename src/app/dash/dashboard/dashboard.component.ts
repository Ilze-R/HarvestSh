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
import { SharedService } from 'src/app/_service/shared.service';
import { DeleteWarnComponent } from 'src/app/warnings/delete-warn/delete-warn.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Input() user: User;
  dialogRef: MatDialogRef<DeleteWarnComponent>;
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
  showGardening: boolean = true;
  showReciepes: boolean = false;
  showImade: boolean = false;
  showOther: boolean = false;
  activeLink: string = 'Gardening';

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

    this.givesState$ = this.giveService.gives$().pipe(
      map((response) => {
        const givesList: Give[] = response.data.give;
        const modifiedResponse = {
          ...response,
          data: { user: response.data.user, give: givesList },
        };
        this.dataGiveSubject.next(modifiedResponse);
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
    this.sharedService.showUGiveComonent = true;
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

  deleteItem(id: number): void {
    this.dialogRef = this.dialog.open(DeleteWarnComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // do confirmation actions
        this.giveService.delete$(id).subscribe({
          next: (response) => {
            console.log('Item deleted successfully', response);
            this.loadData();
          },
          error: (error) => {
            console.error('Error deleting item', error);
          },
        });
      }
      this.dialogRef = null;
    });
  }

  showGardeningSection() {
    this.showGardening = true;
    this.showReciepes = false;
    this.showImade = false;
    this.showOther = false;
    this.activeLink = 'Gardening';
    this.sharedService.currentFormType = 'gardening';
  }
  showReciepesSection() {
    this.showReciepes = true;
    this.showGardening = false;
    this.showImade = false;
    this.showOther = false;
    this.activeLink = 'Reciepes';
    this.sharedService.currentFormType = 'recipe';
  }
  showImadeSection() {
    this.showImade = true;
    this.showReciepes = false;
    this.showGardening = false;
    this.showOther = false;
    this.activeLink = 'Imade';
    this.sharedService.currentFormType = 'iMade';
  }
  showOtherSection() {
    this.showOther = true;
    this.showImade = false;
    this.showReciepes = false;
    this.showGardening = false;
    this.activeLink = 'Other';
    this.sharedService.currentFormType = 'other';
  }
}
